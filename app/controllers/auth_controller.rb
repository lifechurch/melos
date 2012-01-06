class AuthController < ApplicationController
  def connect
    cookies["#{params[:provider]}_auth_redirect"] = params[:redirect] if params[:redirect]
    redirect_to "/auth/#{params[:provider]}"
  end

  def callback
    @info = request.env['omniauth.auth']
    cookies.signed["#{params[:provider]}_auth".to_sym] = @info.except("extra").to_json
    destination = cookies["#{params[:provider]}_auth_redirect"]
    cookies["#{params[:provider]}_auth_redirect"] = nil
    redirect_to destination
  end
end
