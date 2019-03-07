class Campaigns::KidsController < ApplicationController
  include ApplicationHelper
  
  layout 'kids'

  # I'm sure there's a better way to do this, this works for now.
  skip_before_filter :set_page
  # skip_before_filter :set_site   # needed to set the @site var for GA tracking
  skip_before_filter :set_locale
  skip_before_filter :skip_home
  skip_before_filter :check_facebook_cookie
  skip_before_filter :tend_caches
  skip_before_filter :set_default_sidebar
  before_filter :track_event
  before_filter :kids_store_redirect, only: [:index]

  def index
    # /kids
    # tracks requests to /app to GA custom event.
    # then redirects to an store for mobile device if found

    # only allow kids page to localize for the kids whitelist locales
    @locale = :en unless i18n_kids_whitelist.include? I18n.locale
  end

  def create
    # @registration = KidsRegistration.new(phone_number: params[:phone_number])
    # if @registration.save
      render :create
    # else
      # render :index
    # end
  end

  private

  def track_event
  end

  def kids_store_redirect
    if request.env["X_MOBILE_DEVICE"].present?
      # Don't redirect to Google Play Store if locale is zh-CN because store not available in mainland China
      redirect_to kids_store_url unless kids_store_url.nil? || (kids_store_url == 'http://play.google.com/store/apps/details?id=com.bible.kids' && I18n.locale.to_s == 'zh-CN')
    end
  end

  def kids_store_url
    # Rules for redirecting to App Store(s) given the mobile device user agent string
    unless googleBot?(request)
      case request.env["X_MOBILE_DEVICE"] #rack_env["X_MOBILE_DEVICE"]

      when /iphone|iPhone|ipad|iPad|ipod|iPod/
        'https://itunes.apple.com/us/app/bible-for-kids/id668692393?ls=1&mt=8'

      when /android|Android/
        # this link works from an app, not from web
        # 'market://details?id=com.bible.kids'

        # Use this link from Web
        t('kids.links.google').strip

      when /silk|Silk/
        'http://www.amazon.com/gp/mas/dl/android?p=com.bible.kids'
      end
    end
  end
end