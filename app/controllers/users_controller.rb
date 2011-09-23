class UsersController < ApplicationController

  def new
    @user = User.new
  end

  def create
    @user = User.new(params[:user])
    if @user.save
      redirect_to confirm_email_path
    else
      flash.now[:error] = ("The following errors prevented creation of your account:<br />" + @user.errors.join("<br />")).html_safe
      render action: "new"
    end
  end

  def confirm_email
  end
end
