class ConnectionsController < ApplicationController

  def create
    render text: "you're here! session auth is #{cookies.signed[:auth]}"
  end

  def new
    session[:auth_callback_redirect] = create_connection_path
    redirect_to "/auth/#{params[:provider]}"
  end

end
