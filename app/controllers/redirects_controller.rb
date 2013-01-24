class RedirectsController < ApplicationController

  before_filter :force_login

  def friends
    redirect_to(user_following_url(current_user))
  end

  def bookmarks
    redirect_to(user_bookmarks_url(current_user))
  end

  def settings
    redirect_to(edit_user_url(current_user))
  end

  def settings_connections
    redirect_to(connections_user_url(current_user))
  end

  def settings_email
    redirect_to(email_user_url(current_user))
  end

  def settings_password
    redirect_to(password_user_url(current_user))
  end

  def settings_picture
    redirect_to(picture_user_url(current_user))
  end

  def settings_notifications
    redirect_to(notifications_user_url(current_user))
  end

  def settings_devices
    redirect_to(devices_user_url(current_user))
  end

  def delete_account
    redirect_to(delete_account_user_url(current_user))
  end

end