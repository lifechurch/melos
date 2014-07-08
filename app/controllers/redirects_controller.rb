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
    redirect_to(bookmarks_user_url(current_user))
  end

  def settings
    redirect_to(edit_user_url(id: current_user.username))
  end

  # Removing for 3.1 Social launch - will make a comeback when API implements Facebook/Twitter connections
  #def settings_connections
  #  redirect_to(connections_user_url(current_user))
  #end

  def settings_email
    redirect_to(user_email_url(current_user.username))
  end

  def settings_password
    redirect_to(user_password_url(current_user.username))
  end

  def settings_picture
    redirect_to(user_avatar_url(current_user.username))
  end

  def settings_notifications
    redirect_to(edit_notifications_url(token: params[:token]))
  end

  def settings_devices
    redirect_to(user_devices_url(current_user.username))
  end

  def delete_account
    redirect_to(delete_account_user_url(current_user.username))
  end

  def lifechurchtv
    # Resolves to a.youversion.com/groups/lifechurchtv
    redirect_to('/groups/lifechurchtv')
  end

  def ninos
    redirect_to('/es/kids')
  end

end
