class AuthController < ApplicationController

  def callback
    @info = request.env['omniauth.auth']
    cookies.signed[:auth] = @info.except("extra").to_json
    redirect_to session[:auth_callback_redirect]
  end

end
