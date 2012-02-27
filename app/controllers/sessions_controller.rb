class SessionsController < ApplicationController
  before_filter :set_redirect, except: [:destroy]

  def new
  end

  def create
    begin
      user = User.authenticate(params[:username], params[:password])
    rescue AuthError
      user = false
    end

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
