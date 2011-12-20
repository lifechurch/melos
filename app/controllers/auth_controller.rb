class AuthController < ApplicationController

  def callback
    @info = request.env['omniauth.auth']
    puts @info
    puts @info.to_json
    session[:auth] =
    redirect_to session[:auth_callback_redirect]
  end

end
