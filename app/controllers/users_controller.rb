class UsersController < ApplicationController

  def new
    @user = User.new
  end

  def create
    @user = User.new(params[:user])
    if @user.create
      redirect_to confirm_email_path
    else
      render action: "new"
    end
  end

  def confirm_email
  end

  def show
    @user = User.find(params[:id], auth: current_auth)
    @me = (current_auth && @user.id == current_auth.user_id)
  end
end
