class NotificationsController < ApplicationController

  respond_to :html, :json

  before_filter :force_login, only: [:show]
  before_filter :force_notification_token_or_login, only: [:edit, :update]

  def show
    @notifications = get_notifications
    respond_with @notifications
  end


  def edit
    @selected = :notifications
    @user = get_user
    @results = NotificationSettings.find(params[:token].present? ? {token: params[:token]} : {auth: current_auth})
    @settings = @results.data
    self.sidebar_presenter = Presenter::Sidebar::User.new(@user,params,self)
  end


  def update
    @settings = NotificationSettings.find(params[:token] ? {token: params[:token]} : {auth: current_auth})
    @results = @settings.update(params[:settings] || {})
    if @results.valid?
       flash[:notice] = t('users.profile.updated notifications')
       redirect_to(edit_notifications_path(token: params[:token]))
    else
      @user = get_user
      flash[:error] = t('users.profile.notification errors')
      render :settings
    end
  end

  private

  def get_user
    if current_auth
      current_user
    elsif settings = NotificationSettings.find({token: params[:token]})
      User.find(settings.user_id)
    else
      force_login
    end
  end


  def get_notifications
    notifications = current_auth.present? ? Notification.all(auth: current_auth) : []
    # Filter on params[:length] if necessary
    notifications = notifications[0...params[:length].to_i] if params[:length]
    notifications
  end

  def force_notification_token_or_login
    force_login unless logged_in? or params[:token].present?

    if params[:token]
      if logged_in? && current_user.notifications_token != params[:token]
        redirect_to sign_out_path(redirect: edit_notifications_url) and return
      end
    end
  end

end