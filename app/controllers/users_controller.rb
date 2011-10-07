class UsersController < ApplicationController

  def new
    @user = User.new
  end

  def create
    @user = User.new(params[:user])
    if @user.save
      redirect_to confirm_email_path
    else
      render action: "new"
    end
  end

  def confirm_email
  end
end
