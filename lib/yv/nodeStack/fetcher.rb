module YV
  module Nodestack
    class Fetcher

      JSON_500 = JSON.parse('{"response": {"code": 500, "data": {"errors": [{"json": "MultiJson::DecodeError"}]}}}')
      JSON_500_General = JSON.parse('{"response": {"code": 500, "data": {"errors": [{"json": "General Node Stack Error"}]}}}')
      JSON_408 = JSON.parse('{"response": {"code": 408, "data": {"errors": [{"json": "Node Stack Timeout Error"}]}}}')
      
      class << self
        def get(key, opts={})
          resource_url = 'http://localhost:3000/featureImport/event/1'
          curb_get = lambda do
            begin

              post_body = { from: "rails", auth: opts[:auth] }  # "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbiI6ImUyMWQ1NGFjMTdiZmQwZWFjOTQ4OGYyYzE4N2NiYjc3NTNmZWNmNWU3MmM5YjdhNDMxZDY2ZGRmODFlODM1Mzg2ZWQyNTA3YTliNTdmMDg5YmE2YzRlZjhlZDQ4NGEzMjAyYTcxOGRkNGVlNWNmZDhmZDE2MzcyZmY2ODA4NWI3OTYzMTY0Y2VlMzgzMGFkNTI2YzZmMDFhNDJiMzQxYWIzYzljYjQ5YTE0NmMyNGMxMGRhNWM1ZTI2MTdhOTZlNTBiMmFhYjJiMzc4MWU3MTYyYWQyYjIzMzcyNGI0YjBmZmEzZjZiYTY3NzIyMmVjM2YwNDA0Yzg5MDU0MDBjYzA2NDNhZmE3MjM0YTFjMjgxOTJhYThhZjIxZTYxMmZlYTk4MTdmZTlmYjRiZGZhNThiYzM4N2JlOWI0MmI1MzQyMGRlYmQ0ZmI0ZTcwYTliOTVkNTMwZGE0ZmQxNTQ0YTAiLCJpYXQiOjE0NTc2Mzg4NjQsImV4cCI6MTQ1NzcyNTI2NCwiaXNzIjoiaHR0cDovL2JpYmxlLmNvbSJ9.mbE4OrLrGv6o3_bhdrzmZKaVZ8kVfrUPm9qmzilxTDo" }

              curl = Curl::Easy.http_post(resource_url, post_body.to_json ) do |c|
                c.headers['Accept'] = 'application/json'
                c.headers['Content-Type'] = 'application/json'
                c.timeout = opts[:timeout] || Cfg.api_default_timeout.to_f
                c.encoding = ''
                if opts[:auth][:token].present?
                  c.headers['Authorization'] = 'Bearer ' + opts[:auth][:token]
                end
              end

              response = JSON.parse curl.body_str

              if curl.response_code >= 400 && curl.body_str.nil?
                Raven.capture do
                  raise NodeStackError, "Node Stack Fetch Error: Bad Response (code: #{curl.response_code}) "
                end
                return JSON_500_General

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
        
      end
    end
  end
end