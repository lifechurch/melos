class ApplicationController < ActionController::Base
  include UrlHelper
  protect_from_forgery
  helper_method :current_auth, :current_user
  before_filter :set_locale

  # Set locale
  def set_locale
    puts request.subdomains.first
    return redirect_to params.merge(host: with_subdomain("www")) if request.subdomains.empty?
    parsed_locale = request.subdomains.first
    if parsed_locale == "www"
      cookies[:locale].blank? ? visitor_locale = I18n.default_locale : visitor_locale = cookies[:locale].to_sym
      cookies.permanent[:locale] = {value: visitor_locale, domain: request.domain}
      return redirect_to params.merge(host: with_subdomain(visitor_locale.to_s)) unless visitor_locale == :en
    else
      visitor_locale = I18n.available_locales.include?(parsed_locale.to_sym) ? parsed_locale.to_sym : :en
      cookies.permanent[:locale] = {value: visitor_locale, domain: request.domain}
      return redirect_to params.merge(host: with_subdomain("www")) if visitor_locale == :en
    end
    I18n.locale = visitor_locale
    puts I18n.locale
  end

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
