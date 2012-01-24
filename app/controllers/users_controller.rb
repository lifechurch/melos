class UsersController < ApplicationController
  before_filter :force_login, only: [:profile, :update_profile, :picture, :update_picture, :notifications, :update_notifications, :password, :update_password, :connections, :devices, :destroy_device]
  before_filter :find_user, except: [:new, :create, :confirm_email, :confirm, :new_facebook, :create_facebook]
  
  # User signup flow:
  #
  #  +>  /sign-up (users#new)  <-err--------+
  #  |     |             |                  |
  #  |   form submit   facebook btn         |
  # err    |                 \              |
  #  |  success?           facebook auth (/auth/facebook/sign-up)
  #  |   /   \                  \           |
  #  +-no     yes              success?     |
  #            |                /    \      |
  #      /confirm-email      yes     no ----+
  #          (...)            |
  #       clicks link      /sign-up/facebook   <----+
  #           |               |                     |
  #       /confirm        fill out form & submit    |
  #           |                     |               |
  #       valid code?           success?           err
  #         /     \              /    \             |
  #       yes     no           yes     no ----------+
  #        |       \            |
  #     redirect   /confirm     |
  #        |       (with error) |
  #        +--------------------+
  #        |
  #   /sign-up/success (or sign_up_redirect)

  def new
    cookies[:sign_up_redirect] = params[:redirect] if params[:redirect]
    @user = User.new
    render action: "new", layout: "application"
  end

  def create
    @user = User.new(params[:user])
    if @user.save
      # save username and password so we can sign them back in
      cookies.signed[:f] = params[:user][:username]
      cookies.signed[:g] = params[:user][:password]
      redirect_to confirm_email_path
    else
      render action: "new"
    end
  end

  def confirm_email
    render layout: "application"
  end

  def confirm
    response = YvApi.post("users/confirm", hash: params[:hash]) do |errors|
      new_errors = errors.map { |e| e["error"] }
      self.errors[:base] << new_errors
      return false
    end
    if response
      redirect_to cookies[:sign_up_redirect] ||= sign_up_success_path(show: "facebook")
    end
  end

  def new_facebook
    flash.now[:notice] = t('users.facebook sign up success')
    facebook_auth = JSON.parse cookies.signed[:facebook_auth]
    @user = User.new
    @user.email = facebook_auth["info"]["email"]
    @user.verified = true
  end

  def create_facebook
    facebook_auth = JSON.parse cookies.signed[:facebook_auth]
    @user = User.new(params[:user])
    @user.email = facebook_auth["info"]["email"]
    @user.verified = true
    if @user.save
      # Get the real thing
      user = User.authenticate(params[:username], params[:password])
      cookies.permanent.signed[:a] = user.id
      cookies.permanent.signed[:b] = user.username
      cookies.permanent.signed[:c] = params[:password]
      cookies.permanent[:avatar] = user.user_avatar_url["px_24x24"]
      redirect_to cookies[:sign_up_redirect] ||= sign_up_success_path(show: "facebook")
    else
      render action: "new_facebook"
    end
  end

  def sign_up_success
    
  end

  def show
    @selected = :recent_activity
  end

  def notes
    @selected = :notes
    @notes = @user.notes(page: params[:page])
  end

  def likes
    @user.likes(page: params[:page])
    @selected = :likes
  end

  def bookmarks
    @bookmarks = @user.bookmarks(page: params[:page])

    @selected = :bookmarks
    if @me
      @labels = Bookmark.labels_for_user(@user.id)if Bookmark.labels_for_user(@user.id)
      render "bookmarks/index", layout: "application"
    end
  end

  #
  # Profile actions
  #

  def profile
    @selected = :profile
  end

  def update_profile
    result = @user.update(params[:user]) ? flash.now[:notice]=(t('users.profile.updated')) : flash.now[:error]=(t('users.profile.error'))
    render action: "profile"
  end

  def picture
    @selected = :picture
  end

  def update_picture
    result = @user.update_picture(params[:user][:image])
    result ? flash.now[:notice] = t('users.profile.updated picture') : flash.now[:error] = @user.errors
    render action: "picture"
  end

  def notifications
    @notification_settings = NotificationSettings.find(auth: current_auth)
    @selected = :notifications
  end

  def update_notifications
    @notification_settings = NotificationSettings.find(auth: current_auth)
    result = @notification_settings.update(params[:notification_settings])
    result ? flash.now[:notice] = t('users.profile.updated notifications') : flash.now[:error] = @user.errors
    render action: "notifications"
  end

  def password
    @selected = :password
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
    @selected = :connections
  end

  def devices
    @devices = @user.devices
    @selected = :devices
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

  def following
    @users = @user.following
    @selected = :friends
  end
  
private  
  def find_user
    user_id = params[:user_id] || params[:id]
    if user_id
      @user = User.find(user_id, auth: current_auth)
      @me = (current_auth && @user.id.to_i == current_auth.user_id.to_i)
    else
      @user = current_user
      @me = true
    end
  end
end
