class ApplicationController < ActionController::Base
  protect_from_forgery
  helper_method :current_auth, :current_user
  # before_filter :set_locale

  # Set locale
  # def set_locale
  #   I18n.locale = extract_locale_from_subdomain || I18n.default_locale
  # end
  #
  # def extract_locale_from_subdomain
  #   parsed_locale = request.subdomains.first
  #   I18n.available_locales.include?(parsed_locale.to_sym) ? parsed_locale : nil
  # end

  # Manually throw a 404
  def not_found
    raise ActionController::RoutingError.new('Not Found')
  end

  private

  def current_auth
    @current_auth ||= Hashie::Mash.new( {id: cookies.signed[:a], username: cookies.signed[:b], password: cookies.signed[:c]} ) if cookies.signed[:a]
  end

  def current_user
    @current_user ||= User.find(current_auth) if current_auth
  end
end
