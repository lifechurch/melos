class UsersController < ApplicationController

  before_filter :force_login, only: [:show, :notes, :highlights, :bookmarks, :badges, :share, :edit, :update, :picture, :update_picture,:delete_account, :delete_account_form]
  before_filter :find_user, except: [:_cards,:sign_up_success, :new, :create, :confirm_email, :new_facebook, :create_facebook, :resend_confirmation, :share]
  before_filter :set_redirect, only: [:new, :create]
  before_filter :authorize, only: [:edit,:update,:delete_account,:destroy]

  # New find user method - transitioning to this over time and getting rid of prev 'find_user' filter
  before_filter :find_user_for_moments, only: [:show,:notes,:highlights,:bookmarks,:badges]

  rescue_from APIError, with: :api_error

  
  # Action meant to render moment cards partial to html for ajax delivery client side
  # Currently being used for next page calls on moments feed.
  def _cards
    @user = User.find(params[:id])
    @page ||= params[:page]
    @kind ||= params[:kind]
    @moments = Moment.all(moment_all_params)
    render partial: "moments/cards", locals: {moments: @moments, comments_displayed: false}, layout: false
  end

  def show;       end
  def notes;      end
  def highlights; end

  def bookmarks
    @labels = Bookmark.labels(auth: current_auth)
  end

  def badges
    @badges = @user.badges
  end



  def new
    redirect_to moments_path and return if current_auth

    @user = User.new
    self.sidebar_presenter = Presenter::Sidebar::UsersNew.new(@user,params,self)
    render action: "new", layout: "application" #neccessary to use app layout instead of users layout.
  end

  def create
    redirect_to moments_path and return   if current_auth
    render_404 and return                 unless params[:user].present?
    @user = User.register(params[:user].merge!(language_tag: I18n.locale))
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

  def edit
    @selected = :profile
    render layout: "settings"
  end

  def update
    @user.auth = current_auth # setup auth prior to update
    @user = @user.update(params[:user])
    if @user.valid?
      flash[:notice]= t('users.profile.updated')
      redirect_to edit_user_path(current_auth.username)
    else
      flash[:error]= t('users.profile.error')
      render action: "edit", layout: "application"
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


  def delete_account
    render layout: "settings"
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


private

  def moment_all_params
    {user_id: @user.id.to_i, page: @page, auth: current_auth, kind: @kind}
  end

  def find_user_for_moments
    @user = User.find(params[:id])
  end

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

  def api_error(exception)
    if exception.message == "No user with this username/email address"
      render_404
    else
      raise(exception)
    end
  end

end
