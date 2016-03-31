module YV
  module Nodestack
    class Fetcher

      JSON_500 = JSON.parse('{"response": {"code": 500, "data": {"errors": [{"json": "MultiJson::DecodeError"}]}}}')
      JSON_500_General = JSON.parse('{"response": {"code": 500, "data": {"errors": [{"json": "General Node Stack Error"}]}}}')
      JSON_408 = JSON.parse('{"response": {"code": 408, "data": {"errors": [{"json": "Node Stack Timeout Error"}]}}}')

      CookieName = 'YouVersionToken'

      INVALID_TOKEN_ERROR = 1

      class << self
        def get(feature, params, cookies, current_auth, current_user)

          if cookies.has_key?(CookieName)
            auth = auth_from_cookie(cookies)
          elsif current_user && current_auth && current_auth.has_key?(:user_id) && current_user.present?
            auth = auth_from_credentials(current_auth, current_user)
          else
            auth = {}
          end

          resource_url = Cfg.event_import_url
          curb_get = lambda do
            begin
              post_body = { feature: feature, params: params, auth: auth }

              curl = Curl::Easy.http_post(resource_url, post_body.to_json ) do |c|
                c.headers['Accept'] = 'application/json'
                c.headers['Content-Type'] = 'application/json'
                c.timeout = Cfg.api_default_timeout.to_f
                c.encoding = ''
                if auth[:token].present?
                  c.headers['Authorization'] = 'Bearer ' + auth[:token]
                end
              end

              response = JSON.parse curl.body_str

              if curl.response_code >= 400 && curl.body_str.nil?
                Raven.capture do
                  raise NodeStackError, "Node Stack Fetch Error: Bad Response (code: #{curl.response_code}) "
                end
                return JSON_500_General
              end

              if (response['error'] == INVALID_TOKEN_ERROR)
                cookies.delete CookieName
                return get(feature, params, cookies, current_auth, current_user)
              end

              if (!cookies.has_key?(CookieName) || cookies[CookieName] != response['token']) && response['token']
                cookies[CookieName] = { value: response['token'], expires: 24.hour.from_now }
              end

              return response

            rescue MultiJson::DecodeError => e
              JSON_500

            rescue Timeout::Error => e
              Raven.capture do
                raise NodeStackTimeoutError, log_node_stack_timeout(resource_url,started_at)
              end
              JSON_408

            rescue Curl::Err::TimeoutError => e
              Raven.capture do
                raise NodeStackTimeoutError, log_node_stack_timeout(resource_url,started_at)
              end
              JSON_408

            rescue Exception => e
              Raven.capture do
                raise NodeStackError, log_node_stack_error(resource_url,e)
              end
              JSON_500_General

            end
          end
          return curb_get.call
        end

        private

        def log_node_stack_error(path,ex)
          "Non-timeout Node Stack Fetch Error for #{path}: #{ex.class} : #{ex.to_s}"
        end

        def log_node_stack_timeout(path,start)
          "Node Stack Fetch Timeout for #{path} (waited #{((Time.now.to_f - start)*1000).to_i} ms)"
        end

        def auth_from_cookie(cookies)
          return { token: cookies[CookieName] }
        end

        def auth_from_credentials(current_auth, current_user)
          return { userid: current_auth.user_id, email: current_user.email, password: current_auth.password, first_name: current_user.first_name, last_name: current_user.last_name, language_tag: current_user.language_tag, timezone: current_user.timezone }
        end
        
      end
    end
  end
end