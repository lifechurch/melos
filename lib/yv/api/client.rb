module YV
  module API
    class Client
      
      include HTTParty
      format :json
      headers 'Referer' => "http://" + Cfg.api_referer
      headers 'User-Agent' => "Web App: #{ENV['RACK_ENV'] || Rails.env.capitalize}"
      default_timeout Cfg.api_default_timeout.to_f

      class << self
        
        alias_method :httparty_get, :get
        alias_method :httparty_post, :post

        # Perform a GET request to YouVersion API
        # requires an appropriate API formatted path string: "search/notes", "reading-plans/view", etc
        def get(path, opts={}, &block)
          started_at = Time.now.to_f
          
          opts = prepare_auth!(opts)
          opts = clean_request_opts!(opts)
          resource_url = get_resource_url(path, opts)
          
          request_opts = {}
          request_opts[:timeout]  = opts.delete(:timeout) if opts[:timeout] # don't allow timeout to be nil, as this will override the default timeout set in HTTParty
          request_opts[:query]    = opts.except(:cache_for)
          
          lets_party = lambda do
            begin
              response = httparty_get(resource_url, request_opts)
              # Raise an error here if response code is 400 or greater and the API hasn't sent back a response object.
              # IMPORTANTLY - This avoids us potentially caching a bad API request
              # #{response["response"]["data"]["errors"]}
              if response.code >= 400 && response["response"].nil?
                raise APIError, "API Error: Bad API Response (code: #{response.code}) "
              end
              return response

            rescue Timeout::Error => e
              raise APITimeoutError, "API Timeout for #{resource_url} (waited #{((Time.now.to_f - started_at)*1000).to_i} ms)"
            
            rescue MultiJson::DecodeError => e
              response = JSON_500
            
            rescue Exception => e
              raise APIError, "Non-timeout API Error for #{resource_url}:\n\n #{e.class} : #{e.to_s}"
            end
          end

          # If we're caching this request, try pulling from cache first
          if cache_length = opts[:cache_for]
            response = Rails.cache.fetch( cache_key(path, request_opts) , expires_in: cache_length) do
              lets_party.call # cache miss - call to API
            end
          else
            response = lets_party.call
          end

          return process_api_response(response, block, resource_url: resource_url)
        end


        # Perform a POST request to YouVersion API
        # requires an appropriate API formatted path string: "users/create", "notes/update", etc
        def post(path, opts={}, &block)
          started_at = Time.now.to_f

          opts = prepare_auth!(opts)
          opts = clean_request_opts!(opts)
          resource_url = get_resource_url(path, opts)

          request_opts = {}
          request_opts[:timeout] = opts.delete(:timeout) if opts[:timeout] # override timeout only if its not nil
          request_opts[:body] = opts

          begin
            response = httparty_post(resource_url, request_opts)
            
            # Pretty sure this is custom for Reading Plan completion API response :(
            if response.code == 205
               response = Hash.new
               response["response"] = {"code" => 205,"complete" => true}
            end
          
          rescue Timeout::Error => e
            raise APITimeoutError, "API Timeout for #{resource_url} (waited #{((Time.now.to_f - started_at)*1000).to_i} ms)"
          
          rescue MultiJson::DecodeError => e
            response = JSON_500
          
          rescue Exception => e
            raise APIError, "Non-timeout API Error for #{resource_url}: #{e.class} : #{e.to_s}"
          end

          return process_api_response(response, block)
        end


        private # ------------------------------------------------------------------------------------------------

        # Processes a valid response from the API
        # Handle error condition or build an api object as a response

        def process_api_response(response, block, opts = {})

          response_code = response["response"]["code"]
          response_data = response["response"]["data"]

          if response_code.nil? || response_code.to_i >= 400
            response_errors = response_data["errors"]
            process_api_errors( response_errors )
            secondary_response = block.call(response_errors, response) if block
            raise(APIError, response_errors.map { |e| e["error"] }.join("; ")) if secondary_response.nil?
            return secondary_response
          end

          response_code = response_code.to_i

          return true if (response_code == 201) && (response_data == "Created")
          return true if (response_code == 200) && (response_data == "OK")
          return build_data_object( response_data )
        end


        # Build a Mash object with data returned from the API
        def build_data_object( response_data )
          case response_data
            when Array
              if response_data.first.respond_to?(:each_pair)
                 response_data.map {|data| Hashie::Mash.new(data)}
              else
                 response_data
              end
            
            when Hash
              Hashie::Mash.new(response_data)
            
            when Fixnum # only for users/user_id
              Hashie::Mash.new({user_id: response_data }) 
          end
        end


        # Processes errors returned by the API.
        def process_api_errors( errors_array )
          # Check if it's bad/expired auth and raise an exception
          if errors_array.detect { |e| e["key"] =~ /users.hash.not_verified/ }
            raise UnverifiedAccountError
          end

          if errors_array.detect { |e| e["key"] =~ /users.username_or_password.invalid/ }
            raise AuthError
          end
        end


        # Filter request options to formalize, sanitize, whatever of opts
        def clean_request_opts!(opts)
          # we don't use the cache expiration in the cache key so we need to remove the cache_for if invalid
          # so we don't pull from the cache when we shouldn't
          opts.delete :cache_for if opts[:cache_for].try(:<= , 0)
          opts[:language_tag] = YV::Conversions.to_api_lang_code(opts[:language_tag]) if opts[:language_tag]
          opts
        end

        # prepare basic auth for HTTParty
        # expects an opts hash with username and password key/values
        def prepare_auth!(opts)
          default_options.delete(:basic_auth) # Clear the auth state or it'll keep it around between requests

          if auth = opts.delete(:auth)
            basic_auth(auth[:username], auth[:password])
          end

          opts
        end

        def cache_key(path, opts)
          [path, opts[:query].sort_by{|k,v| k.to_s}].flatten.join("_")
        end

        # Returns a complete resource url for making valid API calls given a API path string
        # opts optional at this point.
        #
        # http(s)://likes.youversionapi.com/3.0/view.json
        def get_resource_url(path, opts = {})
          raise "Invalid API path" unless valid_resource_path?(path)
          "#{get_protocol(path)}://#{get_host(path)}/#{Cfg.api_version}/#{get_endpoint(path)}"
        end

        # Validates a path string is in proper format
        # proper format is: word/word
        # examples: search/notes, users/view, notes/create, audio-bible/chapter, reading-plans/view
        def valid_resource_path?(path)
          path.match(/^[\w-]+\/[\w-]+$/) #
        end

        # Returns the correct protocol given an API path string
        # bible and audio-bible resources require HTTP
        # all other resources require HTTPS.
        def get_protocol(path)
          case path
          when /^(bible|audio-bible)/ #bible / audio-bible apis http
            'http'
          else
            'https'
          end
        end

        # Creates a host string for a particular resource given an API path string
        # likes.youversionapi.com
        def get_host(path)
          "#{get_resource(path)}.#{Cfg.api_root}"
        end

        # Matches and returns the resource path name of a given API path string
        # users/view    -> users is the resource name that would be returned
        # search/notes  -> notes is the resource name
        def get_resource(_path)
          _path.match(/(.+)\/.*/).try(:[], 1)
        end

        # Matches and returns the endpoint path of a given API path string
        # users/view    -> view is the endpoint that would be returned
        # search/notes  -> notes is the endpoint
        def get_endpoint(_path)
          format = ".json"
          path = _path.match(/.+\/(.*)/)[1]  # given users/view this will match 'view'
          path += format unless path.match(/#{format}$/)
          return path
        end
      end

    end
  end
end