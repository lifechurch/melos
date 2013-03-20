class UsersController < ApplicationController
  layout "application", :only => [ :confirm ]

  before_filter :force_login, only: [:sign_up_success, :share, :edit, :update, :picture, :update_picture, :password, :update_password, :connections, :devices, :destroy_device, :update_email_form, :update_email, :confirm_update_email, :delete_account, :delete_account_form, :follow, :unfollow]
  before_filter :force_notification_token_or_login, only: [:notifications, :update_notifications]
  before_filter :find_user, except: [:destroy_device, :highlight_colors, :forgot_password, :forgot_password_form, :new, :create, :confirm_email, :confirm, :confirmed,  :new_facebook, :create_facebook, :notifications, :update_notifications, :resend_confirmation, :confirm_update_email, :sign_up_success, :share]
  before_filter :set_redirect, only: [:new, :create]
  before_filter :authorize, only: [:edit,:update, :connections, :email, :update_email, :password, :update_password, :picture, :update_picture, :devices, :destroy_device, :delete_account,:destroy]

  rescue_from APIError, with: :api_error


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
    @user = User.new
    self.sidebar_presenter = Presenter::Sidebar::UsersNew.new(@user,params,self)
    render action: "new", layout: "application" #neccessary to use app layout instead of users layout.
  end

  def create
    @user = User.register(params[:user].merge(language_tag: I18n.locale))
    if @user.persisted?
      # save username and password so we can sign them back in
      cookies.signed[:a] = @user.id

      if next_redirect?(authorize_licenses_path)
        redirect_to(authorize_licenses_path(confirm: true))
      else
        redirect_to confirm_email_path
      end

    else
      render action: "new", layout: "application"
    end
  end

  def confirm_email
    @selected = :email
    render layout: "application"
  end

  def confirm
    @selected = :email
    @user = User.confirm(params[:hash])

    if @user.errors.blank?
      sign_in @user
      flash.now[:notice] = t("users.account confirmed")
    end
    self.sidebar_presenter = Presenter::Sidebar::Default.new
  end

  def confirmed
    begin
      user = User.authenticate(params[:username], params[:password])
    rescue AuthError
      user = false
    end

    if user
      sign_in user
      redirect_to sign_up_success_path(show: "facebook")
    else
      flash.now[:error] = t("invalid password")
      render action: "confirm", layout: "application"
    end
  end



  def new_facebook
    facebook_auth = JSON.parse cookies.signed[:facebook_auth]
    @user = User.new
    @user.email = facebook_auth["info"]["email"]
    @user.verified = true
    render action: "new_facebook", layout: "application"
  end

  def create_facebook
    facebook_auth = JSON.parse cookies.signed[:facebook_auth]
    @user = User.new(params[:user])
    @user.email = facebook_auth["info"]["email"]
    @user.verified = true
    if @user.save
      # Get the real thing
      user = User.authenticate(params[:user][:username], params[:user][:password])
      cookies.permanent.signed[:a] = user.id
      cookies.permanent.signed[:b] = user.username
      cookies.permanent.signed[:c] = params[:user][:password]
      set_current_avatar(user.user_avatar_url["px_24x24"])

      # Create facebook connection
      #
      info = facebook_auth.symbolize_keys
      info[:auth] = Hashie::Mash.new(user_id: user.id, username: user.username, password: params[:user][:password])
      connection = FacebookConnection.new(info)
      result = connection.save

      redirect_to sign_up_success_path(show: "facebook")
    else
      render action: "new_facebook", layout: "application"
    end
  end

  def sign_up_success
    @show = (params[:show] || "facebook").to_s
    @users = @user.connections[@show].find_friends if @user.connections[@show]
    clear_redirect
    self.sidebar_presenter = Presenter::Sidebar::Default.new
    render action: "sign_up_success", layout: "application"
  end

  def show
    @selected = :recent_activity
  end

  def notes
    @nav = :notes if @me
    @selected = :notes
    @notes = @user.notes(page: params[:page])
    render 'notes/index', layout: "application" if @me
  end

  def badges
    @selected = :badges
    @badges = @user.badges
    self.sidebar_presenter = Presenter::Sidebar::Default.new
  end

  def share
    if current_user.share(params[:share])
      flash[:notice] = t('share success') and redirect_to :back
    else
      flash[:error] = t('share error') and redirect_to :back
    end
  end

  def new_share
    render "share", layout: "application"
  end

  #
  # Profile actions
  #

  def edit
    @selected = :profile
  end

  def update
    result = @user.update(params[:user]) ? flash[:notice]=(t('users.profile.updated')) : flash[:error]=(t('users.profile.error'))
    redirect_to edit_user_path(@user)
  end

  #
  # Profile actions
  #

  # Remove routes for #profile and #update_profile

  def picture
    @selected = :picture
    # we don't know if user has an avatar or not
    @user_avatar_urls = @user.user_avatar_url
  end

  def update_picture
    @user_avatar_urls = @user.user_avatar_url
    if @user.update_picture(params[:user].try(:[], :image))
      flash[:notice] = t('users.profile.updated picture')
      @user_avatar_urls = @user.direct_user_avatar_url
      @bust_avatar_cache = true
      # set cookie so header menu will show new avatar
      set_current_avatar(@user.direct_user_avatar_url["px_24x24"])
    end
    redirect_to(picture_user_path(@user))
  end

  def notifications
    @mobile = env["X_MOBILE_DEVICE"].present?
    begin
      @notification_settings = NotificationSettings.find(params[:token] ? {token: params[:token]} : {auth: current_auth})
      @user = @notification_settings.user
      @me = true
      @selected = :notifications
      self.sidebar_presenter = Presenter::Sidebar::User.new(@user,params,self)
    rescue => ex
      track_exception(ex)
      sign_out
      return redirect_to(sign_in_path(redirect: notification_settings_path), flash: {error: t('users.profile.notifications token error')})
    end
  end

  def update_notifications
    @mobile = env["X_MOBILE_DEVICE"].present?
    @notification_settings = NotificationSettings.find(params[:token] ? {token: params[:token]} : {auth: current_auth})
    @user = @notification_settings.user
    @me = true
    result = @notification_settings.update(params[:notification_settings])
    result ? flash[:notice] = t('users.profile.updated notifications') : flash[:error] = t('users.profile.notification errors')

    redirect_to(notifications_user_path(@user,token: params[:token]))
  end

  def password
    @selected = :password
  end

  def update_password
    @selected = :password
    if params[:user][:old_password] == current_auth.password
      if @user.update_password(params[:user].except(:old_password))
        flash[:notice]=t('users.password.updated')
        cookies.signed.permanent[:c] = params[:user][:password]
      end
    else
      @user.errors.add :base, t('users.password.old was invalid')
    end
    #redirect_to(password_user_path(@user))
    render action: "password"
  end

  def resend_confirmation
    if params[:email]
      if User.resend_confirmation(params[:email])
        render action: "resend_confirmation_success", layout: "application" and return
      else
        flash.now[:error]=(t('users.resend error'))
      end
    end
    render action: "resend_confirmation", layout: "application"
  end

  def connections
    params[:page] ||= 1
    @selected = :connections
    @show = params[:show] ||= "twitter"
    @empty_message = t('users.no connection friends', connection: t(@show))
    if @user.connections[@show]
      begin
        @users = @user.connections[@show].find_friends(page: params[:page])
      rescue
        @users = []
        @users_error = true
        flash.now[:error] = t('users.reset connection')
      end
    end
  end

  def devices
    @devices = @user.devices
    @selected = :devices
  end

  def destroy_device
    @device = Device.find(params[:device_id], auth: current_auth)
    @device.destroy ? flash[:notice] = "Device removed." : flash[:error] = "Could not delete device."
    redirect_to devices_user_path(current_user)
  end

  def email
    @selected = :email
    render template: "users/update_email"
  end

  def update_email_form
    @selected = :email
    render "update_email"
  end

  def update_email
    @selected = :email
    response = @user.update_email(params[:user][:email])
    if response
      render "update_email_success"
    else
      redirect_to( email_user_path(current_user))
    end
  end

  def confirm_update_email
    @user = current_user
    @selected = :email
    response = @user.confirm_update_email(params[:token])
    if response
      redirect_to email_user_path(current_user), notice: t('users.confirm update email success')
    end
  end

  def forgot_password_form
    @selected = :password
    self.sidebar_presenter = Presenter::Sidebar::Default.new
    render "forgot_password", layout: "application"
  end

  def forgot_password
    @selected = :password
    self.sidebar_presenter = Presenter::Sidebar::Default.new
    begin
      result = User.forgot_password(params[:email])
      if result
        sign_out
        render "forgot_password_success", layout: "application"
      else
        flash.now[:error] = t('users.invalid email forgot')
        render "forgot_password", layout: "application"
      end
    rescue UnverifiedAccountError => e
      render "sessions/unverified", layout: "application"
    end

  end

  def delete_account
    @selected = :account_existence
  end

  def destroy
    @selected = :account_existence

    begin
      #auth first to give the validate user is at keyboard, and doesn't just have valid cookies
      user = User.authenticate(current_user.username, params[:password])
    rescue AuthError
      user = false
    end

    if user
      if @user.destroy
        sign_out
        return render "delete_account_success", layout: "application"
      end
    else
      flash.now[:error] = t("invalid password")
    end
    render "delete_account"
  end

  def following
    @users = @user.following({page: params[:page] ||= 1})
    @selected = :following
    if @me
      @empty_message = t('no following found self', link: "/settings/connections")
    else
      @empty_message = t('no following found other', username: @user.username)
    end
    render template: "users/friends"
  end

  def followers
    @users = @user.followers({page: params[:page] ||= 1})
    @selected = :followers
    if @me
      @empty_message = t('no followers found self', link: "/settings/connections")
    else
      @empty_message = t('no followers found other', username: @user.username)
    end
    render template: "users/friends"
  end

  # Friends, etc
  def follow
    if @user.follow(auth: current_auth)
      redirect_to(:back, notice: t('you are now following', username: @user.username))
    else
      redirect_to(:back, error: t('error following user'))
    end
  end

  def unfollow
    if @user.unfollow(auth: current_auth)
      redirect_to(:back, notice: t('you are no longer following', username: @user.username))
    else
      redirect_to(:back, error: t('error unfollowing user'))
    end

  end

  def highlight_colors
    render partial: "users/highlight_color_swatches", layout: false, locals: {auth: current_auth}
  end


private
  # Find requested user and setup appropriate sidebar presenter
  def find_user
    user_id   = params[:user_id] || params[:id]
    @user     = (user_id.to_s.downcase == current_user.try(:username).to_s.downcase) ? current_user : User.find(user_id)
    @me       = true if (@user.id == current_user.try(:id))
    self.sidebar_presenter = Presenter::Sidebar::User.new(@user,params,self)
  end

  def force_notification_token_or_login
    if params[:token]
      if current_user && current_user.notifications_token != params[:token]
        redirect_to sign_out_path(redirect: notification_settings_path) and return
      end
    else
      force_login
    end
  end

  def authorize
    unless @user.id == current_user.id
      redirect_to(edit_user_path(current_user))
    end
  end

  def api_error(exception)
    if exception.message == "No user with this username/email address"
      render_404
    else
      raise(exception)
    end
  end

end
