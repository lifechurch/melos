# Add this file to /lib/health.rb
# Load in cnofig/application.rb
# config.middleware.use Heroku::HttpHealth
# Be sure to put this middleware at the front of all other middlewares.

module Heroku
  class HttpHealth
    def initialize(app)
      @app = app
    end

    def call(env)
      if env["PATH_INFO"] =~ /\A\/?\z/ && env["REQUEST_METHOD"] == "HEAD"
        [200, {"Content-Type" => "text/plain"}, ["OK"]]
      else
        @app.call(env)
      end
    end
  end
end