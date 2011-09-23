class ApplicationController < ActionController::Base
  protect_from_forgery
  helper_method :current_user, :current_username

  # Manually throw a 404
  def not_found
    raise ActionController::RoutingError.new('Not Found')
  end

  private

  def current_user
    @current_user ||= User.find(session[:user_id]) if session[:user_id]
  end
  def current_username
    session[:username] if session[:username]
  end
end
