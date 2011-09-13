class ApplicationController < ActionController::Base
  protect_from_forgery
  
  # Manually throw a 404
  def not_found
    raise ActionController::RoutingError.new('Not Found')
  end
end
