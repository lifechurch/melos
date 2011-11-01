class ApplicationController < ActionController::Base
  protect_from_forgery
  helper_method :current_auth, :current_user
  before_filter :set_locale

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

  # Manually throw a 404
  def not_found
    raise ActionController::RoutingError.new('Not Found')
  end

  private

  def current_auth
    @current_auth ||= Hashie::Mash.new( {'id' => cookies.signed[:a], 'username' => cookies.signed[:b], 'password' => cookies.signed[:c]} ) if cookies.signed[:a]  
  end
  def current_user
    unless @current_user
      @current_user = User.find(cookies.signed[:a]) if cookies.signed[:a]      
      @current_user.username = cookies.signed[:b]
      @current_user.password = cookies.signed[:c]
    end
   @current_user
  end
  def current_username
    User.find(cookies.signed[:a]).username if cookies.signed[:a]      
  end
end
