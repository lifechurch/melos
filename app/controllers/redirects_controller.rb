class RedirectsController < ApplicationController

  before_filter :force_login, except: [:settings_notifications, :lifechurchtv]

  # skip_filter :set_page,
  #             :set_locale,
  #             :skip_home,
  #             :check_facebook_cookie,
  #             :tend_caches,
  #             :set_default_sidebar,
  #             only: [:legacy_references]


  def bookmarks
    redirect_to(user_bookmarks_url(current_user))
  end

  def settings
    redirect_to(edit_user_url(current_user))
  end

  # Removing for 3.1 Social launch - will make a comeback when API implements Facebook/Twitter connections
  #def settings_connections
  #  redirect_to(connections_user_url(current_user))
  #end

  def settings_email
    redirect_to(user_email_url(current_user))
  end

  def settings_password
    redirect_to(password_user_url(current_user))
  end

  def settings_picture
    redirect_to(user_avatar_url(current_user))
  end

  def settings_notifications
    redirect_to(notifications_user_url(current_user)) and return if current_auth

    token = params[:token]
    begin
      if token and settings = NotificationSettings.find({token: token})
        user = User.find(settings.id)
        redirect_to(notifications_user_url(user, token: params[:token]))
      else
        force_login
      end
    rescue APIError, YV::ResourceError
      force_login
    end
  end

  def settings_devices
    redirect_to(user_devices_url(current_user))
  end

  def delete_account
    redirect_to(delete_account_user_url(current_user))
  end

  def lifechurchtv
    # Resolves to a.youversion.com/groups/lifechurchtv
    redirect_to('/groups/lifechurchtv')
  end

end
