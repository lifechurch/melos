class UsersController < ApplicationController
  before_filter :force_login, except: [:new, :create, :confirm_email]

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
    @me = (current_auth && @user.id.to_i == current_auth.user_id.to_i)
  end

  def profile
  end

  def update_profile
    @user.auth = current_auth
    result = @user.update(params[:user]) ? flash.now[:notice]=(t('users.profile.updated')) : flash.now[:error]=(t('users.profile.error'))
    render action: "profile"
  end

  def picture
  end

  def update_picture
    result = @user.update_picture(params[:user][:image])
    result ? flash.now[:notice] = t('users.profile.updated picture') : flash.now[:error] = @user.errors
    render action: "picture"
  end

  def notifications
    @notification_settings = NotificationSettings.find(auth: current_auth)
  end

  def update_notifications
    @notification_settings = NotificationSettings.find(auth: current_auth)
    result = @notification_settings.update(params[:notification_settings])
    result ? flash.now[:notice] = t('users.profile.updated notifications') : flash.now[:error] = @user.errors
    render action: "notifications"
  end


  def password
  end

  def update_password
    if params[:user][:old_password] == current_auth.password
      result = @user.update(params[:user]) ? flash.now[:notice]=(t('users.password.updated')) : flash.now[:error]=(t('users.password.error'))
      cookies.signed.permanent[:c] = params[:user][:password] if result
    else
      flash.now[:error]= t('users.password.old was invalid')
    end
    render action: "password"
  end

  def connections
  end

  def devices
    @devices = @user.devices
  end

  def destroy_device
    @device = Device.find(params[:id], auth: current_auth)
    if @device.destroy
      flash[:notice] = "Device removed."
      redirect_to devices_path
    else
      flash.now[:error] = "Could not delete device."
      render action: "devices"
    end
  end

  private

  def force_login
    redirect_to sign_in_path, error: t('users.sign in to access') unless current_auth
    @user = current_user
    @user.auth = current_auth
  end
end
