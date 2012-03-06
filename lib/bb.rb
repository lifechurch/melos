require File.expand_path('../../config/environment',  __FILE__) unless defined?(Rails)

module Bb
  class EndPoint
    def initialize(app)
      @app = app
    end
    def call(env)
      if env["PATH_INFO"] =~ %r{/bb/latest.json}
        process_request(env)
      else
        @app.call(env)
      end
    end

    private
    def process_request(env)
       req = Rack::Request.new(env)
       params = req.params
       # do stuff
       [ 200,
         {'Content-Type' => 'application/json'},
         ['{"response":{"code":200,"data":{"test":"OK"}},"success":1}']
       ]
    end
  end
end
