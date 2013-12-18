class UsersController < ApplicationController

  before_filter :force_login, only: [:show, :notes, :highlights, :bookmarks, :badges, :share, :edit, :update, :picture, :update_picture, :password, :update_password, :devices, :destroy_device, :update_email, :delete_account, :delete_account_form]
  before_filter :force_notification_token_or_login, only: [:notifications, :update_notifications]
  before_filter :find_user, except: [:_cards,:home,:sign_up_success, :confirm_update_email, :update_email, :destroy_device, :forgot_password, :forgot_password_form, :new, :create, :confirm_email, :new_facebook, :create_facebook, :notifications, :update_notifications, :resend_confirmation, :share]
  before_filter :set_redirect, only: [:new, :create]
  before_filter :authorize, only: [:edit,:update, :email, :password, :update_password, :picture, :update_picture, :devices, :delete_account,:destroy]

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


  # Action meant to render moment cards partial to html for ajax delivery client side
  # Currently being used for next page calls on moments feed.
  def _cards
    @user = User.find(params[:user_id])
    @moments = Moment.all(user_id: @user.id.to_i, page: @page, auth: current_auth)
    render partial: "moments/cards", locals: {moments: @moments, comments_displayed: false}, layout: false
  end

  def show
    @user    = User.find(params[:id])
    @moments = Moment.all(user_id: @user.id.to_i, page: @page, auth: current_auth)
  end

  def notes
    @user  = User.find(params[:id])
    @notes = Note.all(user_id: @user.id.to_i , auth: current_auth, page: params[:page] || 1)
  end

  def highlights
    @user  = User.find(params[:id])
    @highlights = Highlight.all(user_id: @user.id.to_i , auth: current_auth, page: params[:page] || 1)
  end

  def bookmarks
    @user  = User.find(params[:id])
    @bookmarks = params[:label] ? Bookmark.for_label(params[:label], {page: @page, user_id: @user.id.to_i, auth: current_auth}) : Bookmark.all(auth: current_auth, user_id: @user.id.to_i, page: @page)
  end

  def badges
    @selected = :badges
    @badges = @user.badges
  end

  def edit
    @selected = :profile
    render layout: "application"
  end


  def new
    @user = User.new
    self.sidebar_presenter = Presenter::Sidebar::UsersNew.new(@user,params,self)
    render action: "new", layout: "application" #neccessary to use app layout instead of users layout.
  end

  def create
    return render_404 unless params[:user].present?

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


  # Template displayed after successful create
  def confirm_email
    @selected = :email
    render layout: "application"
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
    @user.verified = @user.agree = true
    
    if @user.save
      # Get the real thing
      user = User.authenticate(params[:user][:username], params[:user][:password])
      # Create facebook connection
      info = facebook_auth.symbolize_keys
      info[:auth] = Hashie::Mash.new(user_id: user.id, username: user.username, password: params[:user][:password])
      connection = FacebookConnection.new(info)
      result = connection.save

      cookies.permanent.signed[:a] = user.id
      cookies.permanent.signed[:b] = user.username
      cookies.permanent.signed[:c] = params[:user][:password]
      set_current_avatar(user.user_avatar_url["px_24x24"]) if user.user_avatar_url

      redirect_to sign_up_success_path(show: "facebook")
    else
      render action: "new_facebook", layout: "application"
    end
  end

  def sign_up_success
    @user = current_user
    @show = (params[:show] || "facebook").to_s
    clear_redirect
    self.sidebar_presenter = Presenter::Sidebar::Default.new
    render action: "sign_up_success", layout: "application"
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




  def update
    id = @user.id
    @user.auth = current_auth # setup auth prior to update
    @user = @user.update(params[:user])
    if @user.valid?
      flash[:notice]= t('users.profile.updated')
      redirect_to edit_user_path(id)
    else
      flash[:error]= t('users.profile.error')
      render action: "edit", layout: "application"
    end
  end

  def delete_account
    render layout: "application"
  end

  def destroy
    @selected = :account_existence

    begin
      #auth first to give the validate user is at keyboard, and doesn't just have valid cookies
      user = @user = User.authenticate(current_user.username, params[:password])
    rescue AuthError
      user = false
    end

    if user
      @results = @user.destroy
      if @results.valid?
         sign_out
        return render "delete_account_success", layout: "application"
      end
    else
      flash.now[:error] = t("invalid password")
      render action: "delete_account", layout: "application"
    end
    
  end


  # TODO: move this to its own resourceful controller
  def resend_confirmation
    @confirmation = Accounts::Confirmation.new
    if params[:email]
      @confirmation.email = params[:email]
      if @confirmation.resend!
        render action: "resend_confirmation_success", layout: "application" and return
      end
    end
    render action: "resend_confirmation", layout: "application"
  end

  # Email address management
  # TODO: move to its own controller and resource

    def email
      @user = current_user
      render layout: "application"
    end

    def update_email
      @user = current_user
      @results = @user.update_email(params[:user][:email])
      render action: "email", layout: "application"
    end

    # TODO: handle users.token.not_found api error when requesting more than once.
    def confirm_update_email
      @user = User.confirm_update_email(params[:token])
      if @user.valid?
         location = current_user ? edit_user_path(current_user) : sign_in_path
         redirect_to( location , notice: t('users.confirm update email success'))
      end
    end

  # Change password
  # TODO: move to own controller / resource
    def password
      @selected = :password
      render layout: "application"
    end

    # TODO: move this to its own resourceful controller
    def update_password
      @selected = :password
      @user = current_user
      if params[:user][:old_password] == current_auth.password
        @user = @user.update_password(params[:user].except(:old_password))

        if @user.valid?
          flash[:notice]=t('users.password.updated')
          cookies.signed.permanent[:c] = params[:user][:password]
        end
      else
        @user.add_error(t('users.password.old was invalid'))
      end
      render action: "password", layout: "application"
    end

  # Change profile picture
  # TODO: move to own controller / resource

    def picture
      @selected = :picture
      @user = current_user
      @user_avatar_urls = @user.user_avatar_url
      render layout: "application"
    end

    def update_picture
      @selected = :picture
      @user = current_user

      @user_avatar_urls = @user.user_avatar_url
      @results = @user.update_picture(params[:user].try(:[], :image))
      if @results.valid?
         flash[:notice] = t('users.profile.updated picture')
         @user_avatar_urls = @user.direct_user_avatar_url
         @bust_avatar_cache = true
         # set cookie so header menu will show new avatar
         set_current_avatar(@user.direct_user_avatar_url["px_24x24"])
         redirect_to(picture_user_path(@user))
      else
         render action: "picture", layout: "application"
      end
    end

  # Update user notification settings
  # TODO: move to own controller / resource

    def notifications
      @selected = :notifications
      @user = current_user
      @results = NotificationSettings.find(params[:token].present? ? {token: params[:token]} : {auth: current_auth})
      @settings = @results.data
      self.sidebar_presenter = Presenter::Sidebar::User.new(@user,params,self)
      render layout: "application"
    end

    def update_notifications
      @settings = NotificationSettings.find(params[:token] ? {token: params[:token]} : {auth: current_auth})
      @results = @settings.update(params[:settings] || {})
      if @results.valid?
         flash[:notice] = t('users.profile.updated notifications')
         redirect_to(notifications_user_path(current_auth.username,token: params[:token]))
      else
        @user = current_user
        flash[:error] = t('users.profile.notification errors')
        render :notifications, layout: "application"
      end
    end  

  # Manage devices
  # TODO: move to own controller / resource

    def devices
      @devices = Device.all(id: current_user.id, auth: current_auth)
      render layout: "application"
    end



    def destroy_device
      @user = current_user
      @device = Device.find(params[:device_id], auth: current_auth)
      @device.auth = current_auth
      @results = @device.destroy
      if @results.valid?
         flash[:notice] = "Device removed."           # TODO: localize
         redirect_to devices_user_path(current_user)
      else
         @devices = @user.devices
         @selected = :devices
         flash[:error] = "Could not delete device."   # TODO: localize
         render :devices
      end
    end


  # Manage forgotten password
  # TODO: Move to own controller + possible resource

    def forgot_password_form
      @selected = :password
      self.sidebar_presenter = Presenter::Sidebar::Default.new
      render "forgot_password", layout: "application"
    end

    def forgot_password
      @selected = :password
      self.sidebar_presenter = Presenter::Sidebar::Default.new
      begin
        @results = User.forgot_password(params[:email])
        if @results.valid?
          sign_out
          render "forgot_password_success", layout: "application"
        else
          render "forgot_password", layout: "application"
        end
      rescue UnverifiedAccountError => e
        render "sessions/unverified", layout: "application"
      end

    end



private
  # Find requested user and setup appropriate sidebar presenter
  def find_user
    user_id   = params[:user_id] || params[:id]
    @user     = (user_id.to_s.downcase == current_user.try(:username).to_s.downcase) ? current_user : User.find(user_id)
    if @user.valid?
      @me       = true if (@user.try(:id) == current_user.try(:id))
      self.sidebar_presenter = Presenter::Sidebar::User.new(@user,params,self)
    else
      return render_404
    end
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
    id_param = params[:user_id] || params[:id]
    unless id_param == current_user.username
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
