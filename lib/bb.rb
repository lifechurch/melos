require File.expand_path('../../config/environment',  __FILE__) unless defined?(Rails)

module Bb
  class EndPoint
    def initialize(app)
      @app = app
    end
    def call(env)
      path = env["PATH_INFO"]
      if path =~ %r{^(/bb/test|/health)}
        process_test_request(env)
      elsif path =~ %r{^(/bb/latest)}
        process_latest_request(env)
      else
        dup._call(env)
      end
    end

    def _call(env)
      status, headers, body = @app.call(env)
      new_body = []; body.each { |line| new_body << line }
      body.close if body.respond_to?(:close)
      [status, headers, new_body]
    end

    private

    # Support /bb/latest.json requests
    def process_latest_request(env)
      req = Rack::Request.new(env)
      [ 200, {'Content-Type' => 'application/json'},
        ['{"default":{"version":"3.5.2","required":"false","download":"http://m.youversion.com/download?blackberry=true"},"480x360":{"version":"3.5.2","required":"false","download":"http://m.youversion.com/download?blackberry=true"},"480x320":{"version":"3.5.2","required":"false","download":"http://m.youversion.com/download?blackberry=true"},"360x480":{"version":"3.5.2","required":"false","download":"http://m.youversion.com/download?blackberry=true"},"320x240":{"version":"3.5.2","required":"false","download":"http://m.youversion.com/download?blackberry=true"},"240x320":{"version":"3.5.2","required":"false","download":"http://m.youversion.com/download?blackberry=true"},"240x260":{"version":"3.5.2","required":"false","download":"http://m.youversion.com/download?blackberry=true"}}']
      ]
    end

    # Support /bb/test.json requests
    def process_test_request(env)
       req = Rack::Request.new(env)
       params = req.params
       # return expected 'success' response
       [ 200,
         {'Content-Type' => 'application/json'},
         ['{"response":{"code":200,"data":{"test":"OK"}},"success":1}']
       ]
    end
  end
end
