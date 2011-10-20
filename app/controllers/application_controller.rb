class ApplicationController < ActionController::Base
  protect_from_forgery
  helper_method :current_user, :current_username

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
    User.find(cookies.signed[:a]).username if cookies.signed[:a]      
  end
end
