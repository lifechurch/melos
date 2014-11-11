class RedirectsController < ApplicationController

  before_filter :force_login, except: [:settings_notifications, :settings_vod_subscriptions, :lifechurchtv, :ninos, :ertong, :aideul]

  prepend_before_filter :mobile_redirect, only: [:bookmarks, :profile, :friends, :notes, :badges, :highlights, :connections]
  # skip_filter :set_page,
  #             :set_locale,
  #             :skip_home,
  #             :check_facebook_cookie,
  #             :tend_caches,
  #             :set_default_sidebar,
  #             only: [:legacy_references]


  def bookmarks
    redirect_to(bookmarks_user_url(current_user.username, label: params[:label]))
  end

  def settings
    redirect_to(edit_user_url(id: current_user.username))
  end

  def settings_connections
   redirect_to(connections_user_url(current_user.username))
  end

  def profile
    redirect_to(user_url(current_user.username))
  end

  def friends
    redirect_to(user_friends_url(current_user.username))
  end

  def notes
    redirect_to(notes_user_url(current_user.username))
  end

  def badges
    redirect_to(badges_user_url(current_user.username))
  end

  def highlights
    redirect_to(user_highlights_url(current_user.username))
  end

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

  def settings_vod_subscriptions
    redirect_to(vod_subscriptions_url(token: params[:token]))
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

  def ertong
    # Chinese Simplified Redirect to Kids
    redirect_to('/zh-CN/kids')
  end

  def aideul
    # Korean Redirect to Kids
    redirect_to('/ko/kids')
  end

end
