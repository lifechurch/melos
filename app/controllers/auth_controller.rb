class AuthController < ApplicationController

  def connect
    cookies["#{provider_param}_auth_redirect"] = params[:redirect] if params[:redirect]
    redirect_to "/auth/#{provider_param}"
  end

  def callback
    @info = request.env['omniauth.auth']
    cookies.signed["#{provider_param}_auth".to_sym] = @info.except("extra").to_json
    destination = cookies["#{provider_param}_auth_redirect"]
    cookies["#{provider_param}_auth_redirect"] = nil
    redirect_to destination
  end

  private

  def provider_param
    params[:provider]
  end
end
