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
      redirect_to redirect_path || bible_path
      clear_redirect
    else
      flash.now[:error] = t("invalid login")
      render "new"
    end
  end

  def destroy
    sign_out
    clear_redirect # user has signed out, if they sign in, new referer should apply
    redirect_to (request.referer ? URI(request.referer).path : params[:redirect] || bible_path)
  end
end
