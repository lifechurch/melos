class BasicAuth < Rack::Auth::Basic

  def call(env)
    request = Rack::Request.new(env)
    case request.host
    when 'localhost'
      @app.call(env)  # skip auth
    when '127.0.0.1'
      @app.call(env)  # skip auth
    else
      super           # perform auth
    end
  end

end
