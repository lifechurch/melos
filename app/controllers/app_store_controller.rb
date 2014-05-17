class AppStoreController < ActionController::Base
  include YV::Concerns::UserAuth
  include YV::Concerns::Locale
  include ApplicationHelper

  before_filter :set_site, only: [:index]
  before_filter :set_locale_and_timezone # ripped from Concerns::Locale
  before_filter :track_app_download, only: [:index]
  helper_method :current_auth, :ref_from_params, :current_avatar


  # get /app/(:store)
  def index
    return redirect_to store_path_for_device(request.env["X_MOBILE_DEVICE"]) unless request.env["X_MOBILE_DEVICE"].nil?
    return redirect_to store_path(params[:store]) if params[:store].present?
    render "pages/app", layout: "layouts/application"
  end

  private
  # current_auth, ref_from_params, set_site - Ripped these from AppController - we need to move these into lib Modules
  # and include them where needed.

  def current_auth
    return @current_auth if @current_auth
    if cookies.signed[:a] && cookies.signed[:b] && cookies.signed[:c]
      @current_auth ||= Hashie::Mash.new( {'user_id' => cookies.signed[:a], 'username' => cookies.signed[:b], 'password' => cookies.signed[:c]} )
    end
  end

  def ref_from_params
    case
    when params.has_key?(:version)
      Reference.new(params[:reference], version: params[:version])
    else
      Reference.new(params[:reference])
    end
  end

  def set_site
    site_class = YV::Sites::Config.sites[request.domain(2)] #allow tld length of two (e.g. '.co.za')
    @site = site_class.new
  end

  def current_avatar
    # If we're asking for avatar, users has to be signed in
    # which would have populated avatar cookie
    # if they're not, we can't get avatar anyway
    if ((avatar_path = cookies[:avatar]).present?)
      # we may bust browser cache if user just changed avatar
      cache_bust = @bust_avatar_cache ? "#{'?' + rand(1000000).to_s}" : ""

      # cookie may hold old path that can't be secure
      # use CDN path instead if so (API2 to API3 switch)
      if avatar_path.include? 'http://static-youversionapi-com.s3-website-us-east-1.amazonaws.com/users/images/'
        avatar_path.gsub!('http://static-youversionapi-com.s3-website-us-east-1.amazonaws.com/users/images/','https://d5xlnxqvcdji7.cloudfront.net/users/images/')
        set_current_avatar(avatar_path)
      end

      avatar_path +  cache_bust
    end
  end

  def set_locale_and_timezone
    I18n.default_locale = @site.default_locale || :en

    # grab available locales as array of strings and compare against strings.
    available_locales = I18n.available_locales.map {|l| l.to_s}
    visitor_locale    = params[:locale] if available_locales.include?(params[:locale])
    from_param        = visitor_locale.present?

    visitor_locale ||= cookies[:locale] if cookies[:locale].present? and available_locales.include?(cookies[:locale])
    visitor_locale ||= @site.default_locale
    visitor_locale ||= request.preferred_language_from(I18n.available_locales)
    visitor_locale ||= request.compatible_language_from(I18n.available_locales)
    visitor_locale ||= I18n.default_locale
    visitor_locale = visitor_locale.to_sym
    
    set_locale(visitor_locale)
    set_available_locales( @site.available_locales.present? ? @site.available_locales : I18n.available_locales )
  end

  # Rules for App Store url given a custom identifier
  def store_path(store=nil)
    case store
    when /ios/
      'http://itunes.apple.com/WebObjects/MZStore.woa/wa/viewSoftware?id=282935706&mt=8'
    when /android/
      'https://play.google.com/store/apps/details?id=com.sirma.mobile.bible.android'
    when /amazon/
      'http://www.amazon.com/gp/mas/dl/android?p=com.sirma.mobile.bible.android'
    when /bb/
      'http://appworld.blackberry.com/webstore/content/1222'
    when /symbian/
      'http://store.ovi.mobi/content/47384'
    when /j2me/
      'http://getjar.com/bible-app'
    when /windowsphone/
      'zune://navigate/?phoneappid=57f524fa-93e3-df11-a844-00237de2db9e'
    when /webos/
      'http://developer.palm.com/webChannel/index.php?packageid=com.youversion.palm'
    when /windows8/
      'http://apps.microsoft.com/webpdp/app/bible/af5f6405-7860-49a9-a6b4-a47381974e1d'
    else
      '/app'
    end
  end

  # Rules for App Store url given the mobile device user agent string
  def store_path_for_device(device=nil)
    case device
    when /iphone|iPhone|ipad|iPad|ipod|iPod/
      store_path('ios')
    when /android|Android/
      'market://details?id=com.sirma.mobile.bible.android'
    when /silk|Silk/
      store_path('amazon')
    when /blackberry|BlackBerry|bb/
      store_path('bb')
    when /SymbianOS/
      store_path('symbian')
    when /J2ME/
      store_path('j2me')
    when /Windows Phone OS/
      store_path('windowsphone')
    when /webOS|hpwOS/
      store_path('webos')
    when /Windows 8/
      store_path('windows8')
    else
      'https://bible.com'
    end
  end

  def track_app_download
    tracker = Gabba::Gabba.new(@site.ga_code, @site.ga_domain)
    tracker.identify_user(cookies[:__utma], cookies[:__utmz])
    tracker.event("App Download", "#{request.host_with_port}#{request.fullpath}")
  end


end