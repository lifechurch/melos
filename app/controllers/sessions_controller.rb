class SessionsController < ApplicationController
  
  before_filter :set_redirect, except: [:destroy]

  def new
  end

  def create
    begin
      @user = User.authenticate(params[:username], params[:password])
    rescue UnverifiedAccountError
      params[:email] = params[:username] if params[:username].include? "@"
      return render "unverified"
    end

    if @user.valid?
      sign_in(@user, params[:password])
      location = redirect_path
      clear_redirect
      redirect_to(moments_path) and return
    else
      render "new" and return
    end
  end

  def destroy
    sign_out
    redirect_to (params[:redirect] || bible_path)
  end
end
