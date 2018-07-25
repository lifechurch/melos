class UsersController < ApplicationController
  prepend_before_filter :mobile_redirect, only: [:show, :notes, :bookmarks, :badges]
  before_filter :filter_spam_posts, only: [:create]
  before_filter :force_login, only: [:show, :notes, :highlights, :bookmarks, :badges, :share, :edit, :update, :picture, :update_picture,:delete_account, :delete_account_form]
  before_filter :find_user, except: [:user_update_settings, :user_settings, :is_logged_in, :reset_password, :_cards,:sign_up_success, :new, :create, :confirm_email, :new_facebook, :create_facebook, :resend_confirmation, :share]
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
    if @moments.valid?
      @subscriptions = Subscription.all(@user, auth: current_auth)
      if @subscriptions
        if @subscriptions.reading_plans
          @subscriptions = @subscriptions.reading_plans.map! { |s| s.id }
        else
          @subscriptions = @subscriptions.map! { |s| s.id }
        end
      end
      render partial: "moments/cards", locals: {moments: @moments, comments_displayed: false}, layout: false
    else
      render 'pages/generic_error'
    end

  end

  def show;       end
  def notes;      end
  def highlights; end

  def bookmarks
    @labels = Bookmark.labels(auth: current_auth)
    @label ||= params[:label]
  end

  def _bookmarks
    @label ||= params[:label]
    @next_cursor ||= params[:next_cursor]
    @kind ||= params[:kind]
    @moments = @label.present? ? Bookmark.for_label(@label, moment_all_params.merge(cursor: @next_cursor)) : @moments = Moment.all(moment_all_params)
    render partial: "moments/cards", locals: {moments: @moments, comments_displayed: false}, layout: false
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
    return redirect_to moments_path if current_auth

    if params.has_key?('tp_token') && params.has_key?('tp_id')
      tp_sign_in
    else
      return render_404 unless params[:user].present?
      @user = User.register(params[:user].merge!(language_tag: I18n.locale))
      if @user.persisted?
        # save username so we can populate sign in form
        cookies.signed[:a] = { value: @user.id, domain: cookie_domain }
        cookies.signed[:b] = { value: @user.email, domain: cookie_domain }

        # maybe something like this, but we have to globally rescue UnverifiedAccountError
        # set_auth(@user.id, params[:user][:password])

        if next_redirect?(authorize_licenses_path)
          return redirect_to(authorize_licenses_path(confirm: true))
        else
          cookies[:tempemail] = { value: @user.email, domain: cookie_domain }
          return redirect_to confirm_email_path(@confirm_email, redirect: params[:redirect])
          # maybe we can sign them in and redirect them. but maybe not.
          # return follow_redirect(notice: "#{t("users.thanks for registering")} #{t("users.confirm email")}")
        end

      else
        return render action: "new", layout: "application"
      end
    end
  end

  def edit
    @selected = :profile
    render layout: "settings"
  end

  def update
    @user.auth = current_auth # setup auth prior to update
    results = @user.update(params[:user])
    if results.valid?
      #User has changed so delete cached user
      user_cache_key = YV::Caching::cache_key("users/view", {query: {id: @user.id}})
      Rails.cache.delete(user_cache_key)

      flash[:notice]= t('users.profile.updated')
      redirect_to edit_user_path(current_auth.username)
    else
      @user = User.find_by_id(@user.id)
      flash[:error]= results.errors[:base].first || t('users.profile.error')
      render action: "edit", layout: "settings"
    end
  end


  # Template displayed after successful create
  def confirm_email
    @email = cookies[:tempemail]
    render layout: "application"
  end

  def download
    @selected = :download
    render action: "download", layout: "settings"
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

      cookies.permanent.signed[:a] = { value: user.id, domain: cookie_domain }
      cookies.permanent.signed[:b] = { value: user.username, domain: cookie_domain }
      cookies.permanent.signed[:c] = { value: params[:user][:password], domain: cookie_domain }

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
    result = current_user.share(params[:share])
    unless result.errors
      return redirect_to :back, flash: {notice: t('share success')}
    end
    errors = result.errors.map { |error| t(error) }.join("<br/>")
    return redirect_to :back, flash: {notice: "#{t('share error')} <br/> #{errors}" }
  end

  def new_share
    render "share", layout: "application"
  end


  def delete_account
    @requirePassword = !(current_auth.has_key?('tp_id') && current_auth.tp_id != nil)
    render layout: "settings"
  end

  def destroy
    @selected = :account_existence

    begin
      #auth first to give the validate user is at keyboard, and doesn't just have valid cookies
      user = User.authenticate(current_user.username, params[:password], current_auth.tp_token)
    rescue AuthError
      user = false
    end

    if user && user.valid?
      @results = @user.destroy
      if @results.valid?
        sign_out
        return render "delete_account_success", layout: "application"
      end
    else
      flash.now[:error] = t("invalid password")
      return render "delete_account", layout: "settings"
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

  def is_logged_in
    if current_auth
      return render :text => true
    else
      return render :text => false
    end
  end

  def user_settings
    if current_auth
      settings = User.view_settings(current_auth)

      if !settings.updated_dt.nil?
        settings.updated_dt = Date.parse(settings.updated_dt).strftime('%Q').to_i
      else
        settings.updated_dt = ""
      end

      return render :json => settings
    else
      return render :json => {}
    end
  end

  def user_update_settings
    if current_auth && params['recent_versions'].present?
      new_settings = User.update_settings(current_auth, { bible: { recent_versions: params['recent_versions'] } })

      if !new_settings.nil? && !new_settings.updated_dt.nil?
        new_settings.updated_dt = Date.parse(new_settings.updated_dt).strftime('%Q').to_i
        return render :json => new_settings
      else
        return render :json => {}
      end
    else
      return render :json => {}
    end
  end

  def reset_password
    p = {
      "token" => params[:token],
      "strings" => {
        "api.users confirm password matches" => t('api.users confirm password matches'),
        "users.my password" => t('users.my password'),
        "users.profile.new password" => t('users.profile.new password'),
        "users.profile.confirm password" => t('users.profile.confirm password'),
        "mobile page.sms error" => t('mobile page.sms error'),
        "app errors.try again" => t('app errors.try again'),
        "api.users password length" => t('api.users password length'),
        "api.users password change" => t('api.users password change'),
        "api.users username or password invalid" => t('api.users username or password invalid'),
        "users.password updated" => t('users.password.updated'),
        "sign in" => t('sign in'),
        "users.password length" => t('users.password length'),
        "users.forgot password prompt" => t('users.forgot password prompt')
      }
    }

    fromNode = YV::Nodestack::Fetcher.get('PasswordChange', p, cookies, current_auth, current_user, request, cookie_domain)

    if (fromNode['error'].present?)
      return render_404
    end

    @title = t('users.my password')
    render layout: "node_app", locals: { html: fromNode['html'], js: add_node_assets(fromNode['js']), css: add_node_assets(fromNode['css']), css_inline: fromNode['css_inline']  }
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

  def filter_spam_posts
    if request.post? && !(request.referer.match sign_up_url)
      return render_404
    end
  end
end
