class ConnectionsController < ApplicationController

  before_filter :force_login
  before_filter :authorize


  # GET Display users connections
  # bible.com/users/:id/connections => connections#index
  def index
    @selected = :connections
    @show     = params[:show] || "facebook"
    user_id   = params[:id]
              # Avoid a User.find API call if the current_user is the same as the params[:id] is requesting.
              # Could/should refactor into a helper method or cleaner call in general
    @user     = (user_id.to_s.downcase == current_user.try(:username).to_s.downcase) ? current_user : User.find(user_id)
    @me       = true if (@user.id == current_user.try(:id))

    if @user.connections[@show]
      begin
        # TODO: Move this into an async front end request as the api request to get friends
        # can be slow or can timeout causing an app error.
        # Ajax + connections/friends mini api would be appropriate.
        @friends = @user.connections[@show].find_friends(page: params[:page] || 1)

      rescue Koala::Facebook::AuthenticationError
        @error = t('social.facebook.errors.expired access')
        @friends = []

      rescue
        @error = t('social.errors.reset connection')
        @friends = []
      end
    end
  end

  # GET request to fireoff an omniauth connection request for specified :provider (Twitter,Facebook)
  def new
    cookies["#{provider_param}_connection_redirect"] = params[:redirect]
    redirect_to auth_connect_path(provider_param, redirect: create_connection_path(provider_param))
  end

  def create
    info = ActiveSupport::JSON.decode(cookies.signed["#{provider_param}_auth"]).symbolize_keys
    info[:auth] = current_auth
    connection = "#{provider_param.capitalize}Connection".constantize.new(info)
    result = connection.save
    cookies.signed[:f] = nil if connection.is_a? FacebookConnection
    redirect_to cookies["#{provider_param}_connection_redirect"]
  end

  def destroy
    connection = current_user.connections[provider_param.to_s]
    cookies.signed[:f] = nil if connection.is_a? FacebookConnection
    result = connection.delete
    if connection.delete
      redirect_to :back, notice: t('deleted connection', connection: t(provider_param.to_s))
    else
      redirect_to :back, error: t('deleted connection error', connection: t(provider_param.to_s))
    end

  end

  private

  def provider_param
    unless ["twitter","facebook"].include?(params[:provider])
      raise "Invalid provider parameter"
    end
    return params[:provider]
  end

  def authorize
    unless @user.id == current_user.id
      redirect_to(edit_user_path(current_user))
    end
  end
end