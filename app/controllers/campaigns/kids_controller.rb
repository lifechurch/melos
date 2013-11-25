class Campaigns::KidsController < ApplicationController
  
  layout 'kids'

  # I'm sure there's a better way to do this, this works for now.
  skip_before_filter :set_page
  # skip_before_filter :set_site   # needed to set the @site var for GA tracking
  skip_before_filter :set_locale
  skip_before_filter :skip_home
  skip_before_filter :check_facebook_cookie
  skip_before_filter :tend_caches
  skip_before_filter :set_default_sidebar

  # caches_action :index

  def index
    # /kids
    # tracks requests to /app to GA custom event.
    # then redirects to an store for mobile device if found
    track_event
    redirect_to kids_store_url if request.env["X_MOBILE_DEVICE"].present?
  end

  def create
    @registration = KidsRegistration.new(phone_number: params[:phone_number])
    if @registration.save
      render :create
    else
      render :index
    end
  end

  private

  def track_event
    tracker = Gabba::Gabba.new(@site.ga_code, @site.ga_domain)
    tracker.identify_user(cookies[:__utma], cookies[:__utmz])
    tracker.event("Kids App", "#{request.host_with_port}#{request.fullpath}")
  end

  def kids_store_url

    # Rules for redirecting to App Store(s) given the mobile device user agent string
    case request.env["X_MOBILE_DEVICE"] #rack_env["X_MOBILE_DEVICE"]
    
    when /iphone|iPhone|ipad|iPad|ipod|iPod/
      'http://itunes.apple.com/WebObjects/MZStore.woa/wa/viewSoftware?id=282935706&mt=8'

    when /android|Android/
      'market://details?id=com.sirma.mobile.bible.android'

    when /silk|Silk/
      'http://www.amazon.com/gp/mas/dl/android?p=com.sirma.mobile.bible.android'

    when /blackberry|BlackBerry/
      'http://appworld.blackberry.com/webstore/content/1222'

    when /SymbianOS/
      'http://store.ovi.mobi/content/47384'

    when /J2ME/
      'http://getjar.com/bible-app'

    when /Windows Phone OS/
      'zune://navigate/?phoneappid=57f524fa-93e3-df11-a844-00237de2db9e'

    when /webOS|hpwOS/
      'http://developer.palm.com/webChannel/index.php?packageid=com.youversion.palm'

    else
      'https://www.bible.com/kids'
    end

  end

end