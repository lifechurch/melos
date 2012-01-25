class SessionsController < ApplicationController

  def new
    cookies[:sign_in_redirect] = params[:redirect] ||= URI(request.referer).path
  end

  def create
    user = User.authenticate(params[:username], params[:password])
    if user
      cookies.permanent.signed[:a] = user.id
      cookies.permanent.signed[:b] = user.username
      cookies.permanent.signed[:c] = params[:password]
      cookies.permanent[:avatar] = user.user_avatar_url["px_24x24"]

      redirect_to cookies[:sign_in_redirect] || bible_path
      cookies[:sign_in_redirect] = nil
    else
      flash.now[:alert] = "Invalid username or password"
      render "new"
    end
  end

  def destroy
    cookies.permanent.signed[:a] = nil
    cookies.permanent.signed[:b] = nil
    cookies.permanent.signed[:c] = nil
    redirect_to versions_url, :notice => "Signed out!"
    cookies.permanent[:avatar] = nil
  end
end
