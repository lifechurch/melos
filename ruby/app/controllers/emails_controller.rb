class EmailsController < ApplicationController

  layout "settings"

  before_filter :force_notification_token_or_login

  def show
    @user = current_user
  end

  def update
    @user = current_user
    @results = @user.update_email(params[:user][:email])
    render action: "show"
  end

  # GET
  # Custom action to confirm an email change via a token provided in confirmation email sent to user
  def confirm_update
    @user = User.confirm_update_email(params[:token])
    # render action: "confirm_update"
    if @user.valid?
      location = current_user ? user_email_path(current_user) : sign_in_path
      redirect_to( location , notice: t('users.confirm update email success'))
    end
  end

end
