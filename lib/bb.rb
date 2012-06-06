require File.expand_path('../../config/environment',  __FILE__) unless defined?(Rails)

module Bb
  class EndPoint
    def initialize(app)
      @app = app
    end
    def call(env)
      if env["PATH_INFO"] =~ %r{^/bb/test}
        process_request(env)
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
    def process_request(env)
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
