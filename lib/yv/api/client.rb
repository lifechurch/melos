module YV
  module API
    class Client
      
      include HTTParty
      
      # HTTParty stuff
        format :json
        default_timeout Cfg.api_default_timeout.to_f

      # 500 Json response
        JSON_500 = JSON.parse('{"response": {"buildtime": "", "code": 500, "data": {"errors": []}}}')


      class << self
        
        alias_method :httparty_get,  :get
        alias_method :httparty_post, :post

        # Perform a GET request to YouVersion API
        # requires an appropriate API formatted path string: "search/notes", "reading-plans/view", etc
        def get(path, opts={})
          started_at    = Time.now.to_f
          opts          = options_for_get(prepare_opts!(opts))
          resource_url  = get_resource_url(path, opts)

          lets_party = lambda do
            begin
              response = httparty_get( resource_url , opts)

              # Raise an error here if response code is 400 or greater and the API hasn't sent back a response object.
              # IMPORTANTLY - This avoids us potentially caching a bad API request
              if response.code >= 400 && response.body.nil?
                raise APIError, "API Error: Bad API Response (code: #{response.code}) "
              end
              return response

            rescue MultiJson::DecodeError => e
              JSON_500

            rescue Timeout::Error => e
              raise APITimeoutError, log_api_timeout(resource_url,started_at)
            
            rescue Exception => e
              raise APIError, log_api_error(resource_url,e)
            end
          end

          
          response = data_from_cache_or_api(cache_key(path, opts), lets_party, opts)

          puts "---"
          puts response
          puts resource_url
          puts "GET END  ---- \n"

          return YV::API::Response.new(response)
        end


        # Perform a POST request to YouVersion API
        # requires an appropriate API formatted path string: "users/create", "notes/update", etc
        def post(path, opts={})
          started_at    = Time.now.to_f
          opts          = options_for_post(prepare_opts!(opts))
          resource_url  = get_resource_url(path, opts)

          # puts "\nPOST BODY: (#{resource_url}) -----"
          # puts opts[:body]
          # puts "-----"

          begin
            response = httparty_post( resource_url , opts)
            
            if response.code == 205
               response = JSON.parse('{"response": {"buildtime": "", "code": 205, "complete": true}}')
               # Pretty sure this is custom for Reading Plan completion API response :(
            end
          
          rescue MultiJson::DecodeError => e
            response = JSON_500

          rescue Timeout::Error => e
            raise APITimeoutError, log_api_timeout(resource_url,started_at)
          
          rescue Exception => e
            raise APIError, log_api_error(resource_url,e)
          end

          # puts "---"
          # puts response
          # puts resource_url
          # puts "POST END  ---- \n"

          return YV::API::Response.new(response)
        end


        private # ------------------------------------------------------------------------------------------------

        def data_from_cache_or_api(key,httparty_lambda,opts)
          return httparty_lambda.call unless opts[:cache_for]
          
          # try pulling from cache 
          Rails.cache.fetch( cache_key(path, opts) , expires_in: opts[:cache_for]) do
            httparty_lambda.call # cache miss - we need to call to API
          end
        end


        def default_headers
          { 
            "Referer"                   => "http://" + Cfg.api_referer,
            "User-Agent"                => "Web App: #{ENV['RACK_ENV'] || Rails.env.capitalize}",  # API 3.1 requires a user agent to be set
            "X-YouVersion-Client"       => "youversion",                                           # API 3.1 requires a youversion client header to be set: http://developers.youversion.com/api/docs/3.1/intro.html#headers
            "X-YouVersion-App-Platform" => "web",
            "X-YouVersion-App-Version"  => "0"
          }
        end

        def options_for_get(opts)
          {
            headers: default_headers,
            timeout: opts.delete(:timeout),
            query:   opts.except(:cache_for)
          }
        end

        def options_for_post(opts)
          {
            headers: default_headers.merge('Content-Type' => 'application/json'),
            timeout: opts.delete(:timeout),
            body:    opts.to_json
          }
        end

        def prepare_opts!(opts)
          opts = prepare_auth!(opts)
          opts = clean_request_opts!(opts)
        end

        # Filter request options to formalize, sanitize, whatever of opts
        # we don't use the cache expiration in the cache key so we need to remove the cache_for if invalid
        # so we don't pull from the cache when we shouldn't
        def clean_request_opts!(opts)
          opts.delete :cache_for if opts[:cache_for].try(:<= , 0)
          opts[:language_tag] = YV::Conversions.to_api_lang_code(opts[:language_tag]) if opts[:language_tag]
          opts
        end

        # prepare basic auth for HTTParty
        # expects an opts hash with username and password key/values
        def prepare_auth!(opts)
          # Clear the auth state or it'll keep it around between requests
          default_options.delete(:basic_auth)
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
        def get_resource(path)
          path.match(/(.+)\/.*/).try(:[], 1)
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

        def log_api_error(path,ex)
          "Non-timeout API Error for #{path}: #{ex.class} : #{ex.to_s}"
        end

        def log_api_timeout(path,start)
          "API Timeout for #{path} (waited #{((Time.now.to_f - start)*1000).to_i} ms)"
        end


      end

    end
  end
end