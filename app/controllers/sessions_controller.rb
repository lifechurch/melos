class SessionsController < ApplicationController

  def new
  end

  def create
    user = User.authenticate(params[:username], params[:password])

    if user
      session[:user_id] = user.id
      session[:username] = user.username
      redirect_to versions_url, :notice => "Signed in!"
    else
      flash.now[:alert] = "Invalid username or password"
      render "new"
    end
  end

  def destroy
    session[:user_id] = nil
    session[:username] = nil
    redirect_to versions_url, :notice => "Signed out!"
  end
end
