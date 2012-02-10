class ApplicationController < ActionController::Base
  include ApplicationHelper
  protect_from_forgery
  helper_method :force_login, :find_user, :current_auth, :current_user, :current_date, :last_read, :set_last_read, :current_version, :alt_version, :set_current_version, :bible_path, :current_avatar
  before_filter :set_locale, :set_page

  def set_page
    @page = (params[:page] || 1).to_i
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
  def force_login(opts = {})
    if current_auth.nil?
      opts[:redirect] = request.path
      redirect_to sign_in_path(opts) and return 
      #EVENTUALLY: handle getting the :source string based on the referrer dynamically in the sign-in controller
    end
  end
  def force_notification_token_or_login
    if params[:token]
      redirect_to sign_out_path(redirect: notifications_path(token: params[:token])) and return if current_user && current_user.notifications_token != params[:token]
    else
      force_login
    end
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
