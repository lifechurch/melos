class SessionsController < ApplicationController

  def new
    cookies[:sign_in_redirect] = nil if cookies[:sign_in_redirect] == "" #EVENTUALLY: understand why this cookie is "" instaed of nil/dead, to avoid this workaround
    cookies[:sign_in_redirect] ||= URI(request.referer).path if request.referer
    cookies[:sign_in_redirect] = params[:redirect] if params[:redirect]
  end

  def create
    user = User.authenticate(params[:username], params[:password])
    if user
      sign_in user
      redirect_to cookies[:sign_in_redirect] || bible_path, notice: t("successful sign-in", user: user.username)
      cookies[:sign_in_redirect] = nil
    else
      flash.now[:error] = t("invalid login")
      render "new"
    end
  end

  def destroy
    sign_out
    cookies[:sign_in_redirect] = nil # user has signed out, if they sign in, new referer should apply
    redirect_to (request.referer ? URI(request.referer).path : params[:redirect] || bible_path), notice: t("successful sign-out")
  end
end
