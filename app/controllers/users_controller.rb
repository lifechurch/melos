class UsersController < ApplicationController
  before_filter :force_login, only: [:sign_up_success, :share, :profile, :update_profile, :picture, :update_picture, :password, :update_password, :connections, :devices, :destroy_device, :update_email_form, :update_email, :confirm_update_email, :delete_account, :delete_account_form, :follow, :unfollow]
  before_filter :force_notification_token_or_login, only: [:notifications, :update_notifications]
  before_filter :find_user, except: [:new, :create, :confirm_email, :confirm, :confirmed,  :new_facebook, :create_facebook, :notifications, :update_notifications, :resend_confirmation]
  before_filter :set_redirect, only: [:new, :create]

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
    # Set the blurb
    if params[:source]
      @blurb = t("registration.#{params[:source]} blurb")
    elsif params[:redirect] && params[:redirect].match(/reading\-plans/)
      @blurb = t("registration.plan blurb")
    end

    render action: "new", layout: "application"
  end

  def create
    @user = User.new(params[:user].merge(language_tag: I18n.locale))
    # Try authing them first - poor man's login screen
    # begin
    #       if test_user = User.authenticate(params[:user][:username], params[:user][:password])
    #         sign_in test_user, params[:user][:password]
    #         follow_redirect
    #       end
    #     rescue
      if @user.save
        # save username and password so we can sign them back in
        cookies.signed[:f] = params[:user][:username]
        cookies.signed[:g] = params[:user][:password]
        redirect_to confirm_email_path
      else
        render action: "new", layout: "application"
    # end
    end
  end

  def confirm_email
    @selected = :email
    render layout: "application"
  end

  def confirm
    @selected = :email
    @user = User.confirm(params[:hash])

    if @user.errors.include?(:already_confirmed) && @user.errors.size == 1
      redirect_to sign_in_path(redirect: sign_up_success_path(show: "facebook")), notice: t('users.account already confirmed') and return
    end

    if @user.errors.blank?
      sign_in @user
      flash.now[:notice] = t("users.account confirmed")
    end

    render layout: "application"
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
      render "confirm"
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
    render action: "sign_up_success", layout: "application"
  end

  def show
    @selected = :recent_activity
  end

  def notes
    @nav = :notes if @me
    @selected = :notes
    @notes = @user.notes(page: params[:page])
  end

  def likes
    @likes = @user.likes(page: params[:page])
    @selected = :likes
    @empty_message = t('no likes found', username: @user.name || @user.username )
  end

  def bookmarks
    @selected = :bookmarks
    @nav = :bookmarks if @me
    if params[:label]
      @bookmarks = Bookmark.for_label(params[:label], {page: @page, :user_id => @user.id})
    else
      @bookmarks = @user.bookmarks(page: params[:page])
    end
    @labels = Bookmark.labels_for_user(@user.id, page: @labels_page) if Bookmark.labels_for_user(@user.id)
    render "bookmarks/index", layout: "application" if @me
  end

  def badges
    @selected = :badges
    @badges = @user.badges
  end

  def share
    if @user.share(params[:share])
      redirect_to :back, notice: t('share success')
    else
      redirect_to :back, error: t('share error')
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
    # we don't know if user has an avatar or not
    @user_avatar_urls = @user.user_avatar_url
  end

  def update_picture
    @user_avatar_urls = @user.user_avatar_url
    if @user.update_picture(params[:user].try(:[], :image))
      flash.now[:notice] = t('users.profile.updated picture')
      @user_avatar_urls = @user.direct_user_avatar_url
      @bust_avatar_cache = true
      # set cookie so header menu will show new avatar
      set_current_avatar(@user.direct_user_avatar_url["px_24x24"])
    end
    render action: "picture"
  end

  def notifications
    @notification_settings = NotificationSettings.find(params[:token] ? {token: params[:token]} : {auth: current_auth}) rescue nil

    if @notification_settings.nil?
      sign_out
      return redirect_to(sign_in_path(redirect: notifications_path), flash: {error: t('users.profile.notifications token error')})
    end

    @user = @notification_settings.user
    @me = true
    @selected = :notifications
  end

  def update_notifications
    @notification_settings = NotificationSettings.find(params[:token] ? {token: params[:token]} : {auth: current_auth})
    @user = @notification_settings.user
    @me = true
    result = @notification_settings.update(params[:notification_settings])
    result ? flash.now[:notice] = t('users.profile.updated notifications') : flash.now[:error] = t('users.profile.notification errors')
    render action: "notifications"
  end

  def password
    @selected = :password
  end

  def update_password
    @selected = :password
    if params[:user][:old_password] == current_auth.password
      result = @user.update_password(params[:user].except(:old_password)) ? flash.now[:notice]=(t('users.password.updated')) : flash.now[:error]=(t('users.password.error'))
      cookies.signed.permanent[:c] = params[:user][:password] if result
    else
      flash.now[:error]= t('users.password.old was invalid')
    end
    render action: "password"
  end

  def resend_confirmation
    if params[:email]
      if User.resend_confirmation(params[:email])
        return render action: "resend_confirmation_success", layout: "application"
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
    if @device.destroy
      flash[:notice] = "Device removed."
      redirect_to devices_path
    else
      flash.now[:error] = "Could not delete device."
      render action: "devices"
    end
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
      render "update_email"
    end
  end

  def confirm_update_email
    @selected = :email
    response = @user.confirm_update_email(params[:token])
    if response
      redirect_to update_email_path, notice: t('users.confirm update email success')
    end
  end

  def forgot_password_form
    @selected = :password
    render "forgot_password", layout: "application"
  end

  def forgot_password
    @selected = :password
    result = User.forgot_password(params[:email])
    if result
      sign_out
      render "forgot_password_success", layout: "application"
    else
      flash.now[:error] = t('users.invalid email forgot')
      render "forgot_password", layout: "application"
    end
  end

  def delete_account_form
    @selected = :account_existence
    render "delete_account"
  end

  def delete_account
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
    @selected = :friends
    @really_selected = :following
    if @me
      @empty_message = t('no following found self', link: connections_path)
    else
      @empty_message = t('no following found other', username: @user.username)
    end
    render action: "friends"
  end

  def followers
    @users = @user.followers({page: params[:page] ||= 1})
    @selected = :friends
    @really_selected = :followers
    if @me
      @empty_message = t('no followers found self', link: connections_path)
    else
      @empty_message = t('no followers found other', username: @user.username)
    end
    render action: "friends"
  end

  # Friends, etc
  def follow
    if @user.follow
      redirect_to(:back, notice: t('you are now following', username: @user.username))
    else
      redirect_to(:back, error: t('error following user'))
    end
  end

  def unfollow
    if @user.unfollow
      redirect_to(:back, notice: t('you are no longer following', username: @user.username))
    else
      redirect_to(:back, error: t('error unfollowing user'))
    end

  end

  def privacy
    I18n.locale = :en unless i18n_terms_whitelist.include? I18n.locale
    render action: "privacy", layout: "application"
  end

  def terms
    I18n.locale = :en unless i18n_terms_whitelist.include? I18n.locale
    render action: "terms", layout: "application"
  end

  def highlight_colors
    @highlight_colors = User.highlight_colors(auth: current_auth)
    render partial: "users/highlight_color_swatches", layout: false
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

  def i18n_terms_whitelist
    # the following localizations have the legal terms reviewed in a way that is
    # legally appropriate to show in a localized state
    [:en, :sv, :ja, :vi, :nl, :"pt-BR", :"no", :"zh-CN", :"zh-TW", :ms]
  end
end
