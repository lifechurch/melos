class ApplicationController < ActionController::Base
  include ApplicationHelper
  protect_from_forgery
  helper_method :current_auth, :current_user, :last_read, :set_last_read, :current_version, :set_current_version, :bible_path, :current_avatar
  before_filter :set_locale, :check_beta, :set_page

  def set_page
    puts "params is #{params.inspect}"
    @page = (params[:page] || 1).to_i
  end

  # Set locale
  def set_locale
    parsed_locale = params[:locale]
    if parsed_locale == nil
      cookies[:locale].blank? ? visitor_locale = I18n.default_locale : visitor_locale = cookies[:locale].to_sym
      cookies.permanent[:locale] = visitor_locale
      return redirect_to params.merge!(locale: visitor_locale) unless visitor_locale == :en
    else
      visitor_locale = I18n.available_locales.include?(parsed_locale.to_sym) ? parsed_locale.to_sym : :en
      cookies.permanent[:locale] = visitor_locale
      return redirect_to params.merge!(locale: "") if visitor_locale == :en
    end
    I18n.locale = visitor_locale
  end

  def check_beta
    unless request.path == beta_signup_path
      # Check if the person has beta access
      return if current_auth && cookies.signed[:d] == "yes"
      redirect_to beta_signup_path
    end
  end

  # Manually throw a 404
  def not_found
    raise ActionController::RoutingError.new('Not Found')
  end

  private

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
  end
  def current_avatar
    cookies[:avatar]
  end

  def current_version
    cookies[:version] || Version.default_for(params[:locale] ? params[:locale].to_s : "en")
  end

  def set_current_version(ver)
    cookies.permanent[:version] = ver.osis
  end
end
