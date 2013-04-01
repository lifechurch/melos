class SessionsController < ApplicationController
  before_filter :set_redirect, except: [:destroy]

  def new
  end

  def create
    begin
      user = User.authenticate(params[:username], params[:password])
    rescue UnverifiedAccountError
      user = false
      params[:email] = params[:username] if params[:username].include? "@"
      render "unverified" and return
    rescue AuthError
      user = false
    end

    if user
      sign_in(user)
      location = redirect_path
      clear_redirect
      redirect_to(location || bible_path)
    else
      flash.now[:error] = t("invalid login")
      render "new"
    end
  end

  def destroy
    sign_out
    clear_redirect # user has signed out, if they sign in, new referer should apply
    #redirect_to (request.referer ? URI(request.referer).path : params[:redirect] || bible_path)
    # Lets always send them back to a specific redirect or else the bible.
    redirect_to (params[:redirect] || bible_path)
  end
end
