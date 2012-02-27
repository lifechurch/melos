class ApplicationController < ActionController::Base
  include ApplicationHelper
  protect_from_forgery
  helper_method :set_cookie, :force_login, :find_user, :current_auth, :current_user, :current_date, :last_read, :set_last_read, :current_version, :alt_version, :set_current_version, :bible_path, :current_avatar, :sign_in, :sign_out
  before_filter :set_locale, :set_page
  
  unless Rails.application.config.consider_all_requests_local
    rescue_from Exception, with: :generic_error
    rescue_from APIError, with: :api_error
    rescue_from AuthError, with: :auth_error
    rescue_from APITimeoutError, with: :timeout_error
  end

  def set_page
    @page = (params[:page] || 1).to_i
  end
  def default_url_options
    {:host => "yv.chadbailey.net"}
  end

  # Set locale
  def set_locale
    params[:locale] ||= :en
    I18n.locale = params[:locale]
    # TODO: Take all this out if we decide we like how locales work
    # if parsed_locale == nil
    #   cookies[:locale].blank? ? visitor_locale = I18n.default_locale : visitor_locale = cookies[:locale].to_sym
    #   cookies.permanent[:locale] = visitor_locale
    #   return redirect_to params.merge!(locale: visitor_locale) unless visitor_locale == :en
    # else
    #   visitor_locale = I18n.available_locales.include?(parsed_locale.to_sym) ? parsed_locale.to_sym : :en
    #   cookies.permanent[:locale] = visitor_locale
    #   return redirect_to params.merge!(locale: "") if visitor_locale == :en
    # end
    # I18n.locale = visitor_locale
  end

  # Manually throw a 404
  def not_found
    raise ActionController::RoutingError.new('Not Found')
  end
  
  private
  def sign_in(user)
    cookies.permanent.signed[:a] = user.id
    cookies.permanent.signed[:b] = user.username
    cookies.permanent.signed[:c] = params[:password]
    cookies.permanent[:avatar] = user.user_avatar_url["px_24x24"]
  end
  def sign_out
    cookies.permanent.signed[:a] = nil
    cookies.permanent.signed[:b] = nil
    cookies.permanent.signed[:c] = nil
    cookies.permanent[:avatar] = nil
  end
  def auth_error
    sign_out
    redirect_to(sign_in_path, flash: {error: t('auth error')})
  end
  def timeout_error(ex)
    @error = ex
    render "pages/api_timeout", template: 'layouts/application', :status => 408
  end
  def api_error(ex)
    @error = ex
    render "pages/generic_error", template: 'layouts/application', :status => 502
  end
  def generic_error(ex)
    @error = ex
    render "pages/generic_error", template: 'layouts/application', :status => 500
  end
  def force_login(opts = {})
    if current_auth.nil?
      opts[:redirect] = request.path
      redirect_to sign_in_path(opts) and return 
      #EVENTUALLY: handle getting the :source string based on the referrer dynamically in the sign-in controller
    end
    @user = current_user
  end
  def force_notification_token_or_login
    if params[:token]
      redirect_to sign_out_path(redirect: notifications_path(token: params[:token])) and return if current_user && current_user.notifications_token != params[:token]
    else
      force_login
    end
  end
  def set_redirect
    cookies[:sign_in_redirect] = nil if cookies[:sign_in_redirect] == "" #EVENTUALLY: understand why this cookie is "" instaed of nil/dead, to avoid this workaround
    cookies[:sign_in_redirect] = params[:redirect] if params[:redirect]
    cookies[:sign_in_redirect] ||= URI(request.referer).path if request.referer
  end
  def last_read
    Reference.new(cookies[:last_read]) if cookies[:last_read]
  end
  def set_last_read(ref)
    cookies.permanent[:last_read] = ref.osis
  end
  def current_auth
    @current_auth ||= Hashie::Mash.new( {'user_id' => cookies.signed[:a], 'username' => cookies.signed[:b], 'password' => cookies.signed[:c]} ) if cookies.signed[:a]  
  end
  def current_user
    @current_user ||= User.find(current_auth) if current_auth
  end
  def current_username
    User.find(cookies.signed[:a]).username if cookies.signed[:a]
    #TODO: fix this, it's borked
  end
  def current_avatar
    cookies[:avatar]
  end
  def current_date
    #PERF: could cache but needs benchmarking if faster than checks to correctly invalidate
    current_user ? (DateTime.now.utc + current_user.utc_date_offset).to_date : Date.today
  end
  def current_version
    cookies[:version] || Version.default_for(params[:locale] ? params[:locale].to_s : "en")
  end
  def alt_version
    cookies[:alt_version] || current_version
  end
  def set_current_version(ver)
    cookies.permanent[:version] = ver.osis
  end
end
