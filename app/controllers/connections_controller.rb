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

  def destroy
    connection = current_user.connections[params[:provider].to_s]
    puts "!@# connection is #{connection}"
    result = connection.delete
    puts "!@# result is #{result}"
    if connection.delete
      puts "!@# deleted connection"
      redirect_to :back, notice: t('deleted connection', connection: t(params[:provider].to_s))
    else
      puts "!@# didn't delete connection"
      puts "errors were #{connection.errors.full_messages}"
      redirect_to :back, error: t('deleted connection error', connection: t(params[:provider].to_s))
    end

  end
end
