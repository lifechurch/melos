module YV
  module API
    class Client

      JSON_500 = JSON.parse('{"response": {"code": 500, "data": {"errors": [{"json": "MultiJson::DecodeError"}]}}}')
      JSON_500_General = JSON.parse('{"response": {"code": 500, "data": {"errors": [{"json": "General API Error"}]}}}')
      JSON_408 = JSON.parse('{"response": {"code": 408, "data": {"errors": [{"json": "API Timeout Error"}]}}}')

      class << self

        # Perform a GET request to YouVersion API
        # requires an appropriate API formatted path string: "search/notes", "reading-plans/view", etc
        def get(path, opts={})
          debug = opts.delete :debug
          started_at    = Time.now.to_f
          opts          = options_for_get(prepare_opts!(opts))
          resource_url  = get_resource_url(path, opts)


          curb_get = lambda do
            begin

            curl = Curl::Easy.new
            curl.url = "#{resource_url}?#{opts[:query].to_query}"
            curl.headers = opts[:headers]
            curl.timeout = opts[:timeout] || Cfg.api_default_timeout.to_f
            if opts[:auth].present?
              if opts[:auth][:tp_token].present?
                curl.headers["Authorization"] = opts[:auth][:tp_token]
              else
                curl.http_auth_types = :basic
                curl.username = opts[:auth][:username]
                curl.password = opts[:auth][:password]
              end
            end
            curl.encoding = ''
            curl.perform
            response = JSON.parse curl.body_str

            if curl.response_code >= 400 && response["response"].present? && response["response"]["data"].present? && !response["response"]["data"]["errors"].present?
              response["response"]["data"] = { "errors" => [ { "key" => 'generic_error', "error" => curl.response_code.to_s } ] }
            end

            # Raise an error here if response code is 400 or greater and the API hasn't sent back a response object.
            # IMPORTANTLY - This avoids us potentially caching a bad API request
            if curl.response_code >= 400 && curl.body_str.nil?
              Raven.capture do
                raise APIError, "API Error: Bad API Response (code: #{curl.response_code}) "
              end
              return JSON_500_General

            end
            return response

            rescue MultiJson::DecodeError => e
              JSON_500

            rescue Timeout::Error => e
              Raven.capture do
                raise APITimeoutError, log_api_timeout(resource_url,started_at)
              end
              JSON_408

            rescue Curl::Err::TimeoutError => e
              Raven.capture do
                raise APITimeoutError, log_api_timeout(resource_url,started_at)
              end
              JSON_408

            rescue Exception => e
              Raven.capture do
                raise APIError, log_api_error(resource_url,e)
              end
              JSON_500_General

            end
          end

          response = data_from_cache_or_api(YV::Caching::cache_key(path, opts), curb_get, opts)

          if debug
            puts "---"
            puts "GET OPTIONS:"
            puts opts
            puts
            puts "ACTUAL Response"
            puts response
            puts
            puts resource_url
            puts "GET END  ---- \n"
          end

          return YV::API::Response.new(response)
        end


        # Perform a POST request to YouVersion API
        # requires an appropriate API formatted path string: "users/create", "notes/update", etc
        def post(path, opts={})
          debug = opts.delete :debug
          started_at    = Time.now.to_f
          opts          = options_for_post(prepare_opts!(opts))
          resource_url  = get_resource_url(path, opts)

          if debug
            puts "\nPOST BODY: (#{resource_url}) -----"
            puts opts[:body]
            puts "-----"
          end

          begin

          curl = Curl::Easy.http_post(resource_url, opts[:body]) do |c|
            c.headers = opts[:headers]
            c.timeout = opts[:timeout] || Cfg.api_default_timeout.to_f
            c.encoding = ''
            if opts[:auth].present?
              if opts[:auth][:tp_token].present?
                c.headers["Authorization"] = opts[:auth][:tp_token]
              else
                # puts 'auth'
                c.http_auth_types = :basic
                c.username = opts[:auth][:username]
                c.password = opts[:auth][:password]
              end
            end
          end
          response = JSON.parse curl.body_str

          if curl.response_code >= 400 && response["response"].present? && !response["response"]["data"].present?
            response["response"]["data"] = { "errors" => [ { "key" => 'generic_error', "error" => curl.response_code.to_s } ] }
          end

          rescue MultiJson::DecodeError => e
            response = JSON_500

          rescue Timeout::Error => e
            raise APITimeoutError, log_api_timeout(resource_url,started_at)

          rescue Exception => e
            raise APIError, log_api_error(resource_url,e)
          end

          if debug
            puts "---"
            puts response
            puts resource_url
            puts "POST END  ---- \n"
          end

          return YV::API::Response.new(response)
        end

        def default_headers
          {
            "Referer"                   => "http://" + Cfg.api_referer,
            "User-Agent"                => "Web App: #{ENV['RACK_ENV'] || Rails.env.capitalize} GZIP",  # API 3.1 requires a user agent to be set
            "X-YouVersion-Client"       => "youversion",                                           # API 3.1 requires a youversion client header to be set: http://developers.youversion.com/api/docs/3.1/intro.html#headers
            "X-YouVersion-App-Platform" => "web",
            "X-YouVersion-App-Version"  => "2",
            "Accept-Encoding"           => "gzip, deflate"
          }
        end


        private # ------------------------------------------------------------------------------------------------

        def data_from_cache_or_api(key, curl_lambda, opts={})
          return curl_lambda.call unless opts[:cache_for]
          # try pulling from cache
          Rails.cache.fetch(key,expires_in: opts[:cache_for]) do
            curl_lambda.call # cache miss - we need to call to API
          end
        end

        def options_for_get(opts={})
          query_from_search_call = opts.delete(:query)

          new_opts = {
            headers: default_headers,
            timeout: opts.delete(:timeout) || Cfg.api_default_timeout,
            query:   opts.except(:cache_for).except(:auth)
          }.merge(opts)

          # if we passed in a search 'query' option, merge it in here
          new_opts[:query].merge!(query: query_from_search_call) if query_from_search_call
          new_opts
        end

        def options_for_post(opts={})
          {
            headers: default_headers.merge('Content-Type' => 'application/json'),
            timeout: opts.delete(:timeout) || Cfg.api_default_timeout,
            auth:    opts.delete(:auth),
            body:    opts.to_json
          }
        end

        def prepare_opts!(opts={})
          opts = clean_request_opts!(opts)
        end

        # Filter request options to formalize, sanitize, whatever of opts
        # we don't use the cache expiration in the cache key so we need to remove the cache_for if invalid
        # so we don't pull from the cache when we shouldn't
        def clean_request_opts!(opts = {})
          opts.delete :cache_for if opts[:cache_for].try(:<= , 0)
          opts[:language_tag] = YV::Conversions.to_api_lang_code(opts[:language_tag]) if opts[:language_tag]
          opts
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
          path.match(/^[\w-]+\/[\w-]+(.\w+)?$/) #
        end

        # Returns the correct protocol given an API path string
        # bible and audio-bible resources require HTTP
        # all other resources require HTTPS.
        def get_protocol(path)
          'https'
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
          return path.include?(".") ? path : path += format # if path includes a .format then return string with format, otherwise add json.
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
