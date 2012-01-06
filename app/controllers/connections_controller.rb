class ConnectionsController < ApplicationController

  def create
    info = ActiveSupport::JSON.decode(cookies.signed["#{params[:provider]}_auth"]).symbolize_keys
    info[:auth] = current_auth
    connection = "#{params[:provider].capitalize}Connection".constantize.new(info)
    result = connection.save
    redirect_to cookies["#{params[:provider]}_connection_redirect"]
  end

  def new
    cookies["#{params[:provider]}_connection_redirect"] = params[:redirect]
    redirect_to auth_connect_path(params[:provider], redirect: create_connection_path(params[:provider]))
  end
end
