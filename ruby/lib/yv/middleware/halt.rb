module YV
  module Middleware
    class Halt

      def initialize(app,options)
        @app = app
        @routes = options[:routes]
        @content = "404"
      end

      def call(env)
        if @routes =~ env["PATH_INFO"]
          [404, {'Content-Type' => "text/html", 'Content-Length' => @content.size.to_s}, [@content]]
        else
          @app.call(env)
        end
      end

    end
  end
end