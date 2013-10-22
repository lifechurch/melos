class NotificationsController < ApplicationController

  respond_to :html, :json


  def index
    @notifications = get_notifications
    respond_with @notifications
  end


  private

  def get_notifications
    notifications = current_auth.present? ? Notification.all(auth: current_auth) : []
    # Filter on params[:length] if necessary
    notifications = notifications[0...params[:length].to_i] if params[:length]
    notifications
  end

end