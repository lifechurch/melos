class AuthController < ApplicationController

  def callback
    @info = request.env['omniauth.auth']
    session[:auth] = @info
    redirect_to session[:auth_callback_redirect]
  end

end
