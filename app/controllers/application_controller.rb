class ApplicationController < ActionController::Base
  protect_from_forgery
  helper_method :current_user, :current_username
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

  def current_user
    unless @current_user
      @current_user = User.find(cookies.signed[:a]) if cookies.signed[:a]
      @current_user.username = cookies.signed[:b]
      @current_user.password = cookies.signed[:c]
    end
    @current_user
  end
  def current_username
    cookies.signed[:b] if cookies.signed[:b]
  end
end
