class ConnectionsController < ApplicationController

  def create
    puts "ok, trying to create"
    info = ActiveSupport::JSON.decode(cookies.signed["#{params[:provider]}_auth"]).symbolize_keys
    info[:auth] = current_auth
    puts "before I create, info is #{info}"
    connection = "#{params[:provider].capitalize}Connection".constantize.new(info)
    puts "connection is a #{connection.class}"
    puts "connection credentials is #{connection.credentials}"
    result = connection.save
    puts "connection errors are #{connection.errors.full_messages}" if result == false
    puts "result of save was #{result}"
    redirect_to cookies["#{params[:provider]}_connection_redirect"]
  end

  def new
    puts "when i'm done, i'll redirect to #{params[:redirect]}, and my cookie key is #{params[:provider]}_connection_redirect"
    cookies["#{params[:provider]}_connection_redirect"] = params[:redirect]
    redirect_to auth_connect_path(params[:provider], redirect: create_connection_path(params[:provider]))
  end
end
