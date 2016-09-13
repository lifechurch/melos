class RedirectsController < ApplicationController

  before_filter :force_login, except: [:settings_notifications, :settings_vod_subscriptions, :lifechurchtv, :ninos, :ertong, :aideul, :criancas, :deti, :kinderen, :kinder, :enfants, :ar_kids, :wmf, :anak, :cocuk, :kodomo, :er_tong, :kinderbybel, :pambatang, :thaibafk, :thieunhi, :ragazzi]

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

  def kinder
    # German redirect to kids
    redirect_to('/de/kids')
  end

  def wmf
    redirect_to('/world-meeting-of-families-app')
  end

  def thaibafk
    redirect_to('/th/kids')
  end

  def ninos
    redirect_to('/es/kids')
  end

  def ertong
    # Chinese Simplified Redirect to Kids
    redirect_to('/zh-CN/kids')
  end

  def er_tong
    # Chinese Traditional Redirect to Kids
    redirect_to('/zh-TW/kids')
  end

  def aideul
    # Korean Redirect to Kids
    redirect_to('/ko/kids')
  end

  def criancas
    # Brazilian Portuguese Redirect to Kids
    redirect_to('/pt/kids')
  end

  def deti
    # Russian Redirect to Kids
    redirect_to('/ru/kids')
  end

  def kinderen
    # Dutch Redirect to Kids
    redirect_to('/nl/kids')
  end

  def kinderbybel
    # Afrikaans Redirect to Kids
    redirect_to('/af/kids')
  end

  def enfants
    # French Redirect to Kids
    redirect_to('/fr/kids')
  end

  def anak
    # Indonesian Redirect to Kids
    redirect_to('/id/kids')
  end

  def cocuk
    # Turkish Redirect to Kids
    redirect_to('/tr/kids')
  end

  def ar_kids
    # Arabic Redirect to Kids
    redirect_to('/ar/kids')
  end

  def kodomo
    redirect_to('/ja/kids')
  end

  def pambatang
    redirect_to('/tl/kids')
  end

  def thieunhi
    redirect_to('/vi/kids')
  end

  def ragazzi
    redirect_to('/it/kids')
  end
end
