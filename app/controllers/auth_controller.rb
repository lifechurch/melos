class AuthController < ApplicationController
  def connect
    puts "params redirect is#{params[:redirect]}"
    puts "params provider is #{params[:provider]}"
    cookies["#{params[:provider]}_auth_redirect"] = params[:redirect] if params[:redirect]
    redirect_to "/auth/#{params[:provider]}"
  end

  def callback
    @info = request.env['omniauth.auth']
    puts "=== auth info is #{@info}"
    cookies.signed["#{params[:provider]}_auth".to_sym] = @info.except("extra").to_json
    puts cookies["#{params[:provider]}_auth_redirect"]
    destination = cookies["#{params[:provider]}_auth_redirect"]
    puts "in the auth callback, i should be going to connections#create, and I'm going to #{destination}"
    cookies["#{params[:provider]}_auth_redirect"] = nil
    redirect_to destination
  end
end
