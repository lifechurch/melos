class ApplicationController < ActionController::Base
  protect_from_forgery
  helper_method :current_user, :current_username

  # Manually throw a 404
  def not_found
    raise ActionController::RoutingError.new('Not Found')
  end

  private

  def current_auth
    Hashie::Mash.new( {'id' => cookies.signed[:a], 'username' => cookies.signed[:b], 'password' => cookies.signed[:c]} ) if cookies.signed[:a]  
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
    cookies.signed[:b] if cookies.signed[:b]
  end
end
