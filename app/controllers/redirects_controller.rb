class RedirectsController < ApplicationController

  before_filter :force_login, except: [:settings_notifications, :legacy_references]

  skip_filter :set_page,
              :set_locale,
              :skip_home,
              :check_facebook_cookie,
              :tend_caches,
              :set_default_sidebar,
              only: [:legacy_references]

  def legacy_references
    base_url = "https://www.bible.com"

    case params[:path]

    # /353/GEN1.1.NIV - API 3: bible.us/{version-id}/{book-usfm}{chapter-usfm}.{verse-usfm}.{version-abbreviation}
    when /^(\d+\/.*)/
      redirect_to("#{base_url}/bible/#{$1}") and return

    # Gen1.1.NIV -  Book, chapter, verse and version
    when /^([0-9]?[a-zA-Z]+)(?:([0-9]+)\.([0-9-]+)\.([0-9a-zA-Z-]+))$/
      version = $4.downcase
      book    = $1.downcase
      chapter = $2
      verse   = $3
      redirect_to("#{base_url}/bible/#{version}/#{book}.#{chapter}.#{verse}.#{version}") and return

    # Gen1.1 - Book, chapter and verse
    when /^([0-9]?[a-zA-Z]+)(?:([0-9]+)\.([0-9-]+))$/
      book    = $1.downcase
      chapter = $2
      verse   = $3
      redirect_to("#{base_url}/bible/kjv/#{book}.#{chapter}.#{verse}.kjv") and return

    # Gen1 - Book and chapter
    when /^([0-9]?[a-zA-Z]+)([0-9]+)$/
      book    = $1.downcase
      chapter = $2
      redirect_to("#{base_url}/bible/#{book}.#{chapter}.1") and return

    # Gen  - Book
    when /^([0-9]?[a-zA-Z]+)$/
      book    = $1.downcase
      redirect_to("#{base_url}/bible/#{book}.1.1") and return

    # Gen1.NIV - Book, chapter and version
    when /^([0-9]?[a-zA-Z]+)(?:([0-9]+)\.([0-9a-zA-Z-]+))$/
      version = $3.downcase
      book    = $1.downcase
      chapter = $2
      redirect_to("#{base_url}/bible/#{version}/#{book}.#{chapter}.1.#{version}") and return

    # Gen.NIV - Book and version
    when /^([0-9]?[a-zA-Z]+)\.([0-9a-zA-Z-]+(?![.: ]))$/
      version = $2.downcase
      book    = $1.downcase
      redirect_to("#{base_url}/bible/#{version}/#{book}.1.1.#{version}") and return

    else
      render 'pages/error_404', status: 404
    end
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
    redirect_to(devices_user_url(current_user))
  end

  def delete_account
    redirect_to(delete_account_user_url(current_user))
  end

end
