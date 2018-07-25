class AuthController < ApplicationController

  def connect
    cookies["#{provider_param}_auth_redirect"] = { value: params[:redirect], domain: cookie_domain } if params[:redirect]
    redirect_to "/auth/#{provider_param}"
  end

  def callback
    @info = request.env['omniauth.auth']
    cookies.signed["#{provider_param}_auth".to_sym] = { value: @info.except("extra").to_json, domain: cookie_domain }
    destination = cookies["#{provider_param}_auth_redirect"]
    cookies["#{provider_param}_auth_redirect"] = { value: nil, domain: cookie_domain }
    redirect_to destination
  end

  private

  def provider_param
    params[:provider]
  end
end
