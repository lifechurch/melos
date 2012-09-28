class ApplicationController < ActionController::Base
  include ApplicationHelper
  protect_from_forgery
  helper_method :follow_redirect, :redirect_path, :clear_redirect, :recent_versions, :set_cookie, :force_login, :find_user, :current_auth, :current_user, :current_date, :last_read, :set_last_read, :current_version, :alt_version, :set_current_version, :bible_path, :current_avatar, :set_current_avatar, :sign_in, :sign_out, :verses_in_chapter, :a_long_time, :bdc_user?
  before_filter :set_page
  before_filter :set_locale
  before_filter :set_site
  before_filter :check_facebook_cookie
  before_filter :tend_caches

  unless Rails.application.config.consider_all_requests_local
    rescue_from Exception, with: :generic_error
    rescue_from APIError, with: :api_error
    rescue_from AuthError, with: :auth_error
    rescue_from Timeout::Error, with: :timeout_error
    rescue_from APITimeoutError, with: :timeout_error
  end

  def set_page
    @page = (params[:page] || 1).to_i
    @labels_page = (params[:labels_page] || 1).to_i
  end

  # Set locale
  def set_locale
      visitor_locale = params[:locale].to_sym if I18n.available_locales.include?(params[:locale].try(:to_sym))
      from_param = !visitor_locale.nil?
      visitor_locale ||= cookies[:locale].to_sym if I18n.available_locales.include?(cookies[:locale].try(:to_sym)) #forwards compatibility with lang code changes
      visitor_locale ||= request.preferred_language_from(I18n.available_locales).try(:to_sym)
      visitor_locale ||= request.compatible_language_from(I18n.available_locales).try(:to_sym)
      visitor_locale ||= I18n.default_locale

      cookies.permanent[:locale] = visitor_locale

      return redirect_to params.merge!(locale: "") if from_param && visitor_locale == I18n.default_locale
      return redirect_to params.merge!(locale: visitor_locale) if !from_param && visitor_locale != I18n.default_locale

      I18n.locale = visitor_locale.to_sym
  end

  def set_site
    site_class = SiteConfigs.sites[request.domain(2)] #allow tld length of two (e.g. '.co.za')
    @site = site_class.new

    #render marketing page if bible.com root
    render 'pages/bdc_home' if @site.class == SiteConfigs::Bible && request.path =~ /^\W*$/
  end

  # Manually throw a 404
  def not_found
    raise ActionController::RoutingError.new('Not Found')
  end

  private
  def sign_in(user, password = nil)
    cookies.permanent.signed[:a] = user.id
    cookies.permanent.signed[:b] = user.username
    cookies.permanent.signed[:c] = password || params[:password]
    set_current_avatar(user.user_avatar_url["px_24x24"])
    check_facebook_cookie
  end

  def set_facebook_cookie(user)
    begin
      if user.connections["facebook"]
        facebook_data = user.connections["facebook"].data
        # if the FB cookie doesn't exist, update the potentially outdated token
        # to be safe
        current_user.connections["facebook"].update_token unless cookies.signed[:f].present?
        facebook_data[:valid_date] = Time.zone.now
        cookies.permanent.signed[:f] = facebook_data.to_json
      else
        cookies.permanent.signed[:f] = "none"
      end
    rescue
      # if an error occurs with FB weirness, we don't want
      # that stopping all site access
    end
  end

  def check_facebook_cookie
    if current_auth
      if cookies.signed[:f].present?
        if cookies.signed[:f] == "none"
        else
          begin
            cookie_data = ActiveSupport::JSON.decode(cookies.signed[:f])
            if Time.zone.parse(cookie_data["valid_date"]) < 1.week.ago
              current_user.connections["facebook"].update_token
              set_facebook_cookie current_user
            else
            end
          rescue
            # if an error occurs with FB weirness, we don't want
            # that stopping all site access
          end
        end
      else
        set_facebook_cookie current_user
      end
    end
  end

  def sign_out
    cookies.permanent.signed[:a] = nil
    cookies.permanent.signed[:b] = nil
    cookies.permanent.signed[:c] = nil
    cookies.permanent.signed[:f] = nil
    set_current_avatar(nil)
  end

  def auth_error(ex)
    sign_out
    report_exception(ex)
    redirect_to(sign_in_path, flash: {error: t('auth error')})
  end

  def timeout_error(ex)
    @error = ex
    report_exception(ex)
    render "pages/api_timeout", layout: 'application', status: 408
  end

  def api_error(ex)
    @error = ex
    report_exception(ex)
    render "pages/generic_error", layout: 'application', status: 502
  end

  def generic_error(ex)
    @error = ex
    report_exception(ex)
    render "pages/generic_error", layout: 'application', status: 500
  end


  def set_redirect
    cookies[:auth_redirect] = nil if cookies[:auth_redirect] == "" #EVENTUALLY: understand why this cookie is "" instaed of nil/dead, to avoid this workaround
    cookies[:auth_redirect] = params[:redirect] if params[:redirect]
    cookies[:auth_redirect] ||= URI(request.referer).path if request.referer
  end

  def redirect_path
    cookies[:auth_redirect]
  end

  def clear_redirect
    cookies[:auth_redirect] = nil
  end

  def follow_redirect(opts = {})
    cookie_path = cookies[:auth_redirect].to_s == '' ? nil : cookies[:auth_redirect] #EVENTUALLY: understand why this cookie is "" instaed of nil/dead, to avoid this workaround
    clear_redirect
    path = cookie_path || opts[:alt_path] || bible_path
    return redirect_to path, notice: opts[:notice] if opts[:notice]
    return redirect_to path, error: opts[:error] if opts[:error]
    return redirect_to path
  end

  def external_request?
    return true if request.referrer.nil?

    return false if request.host == request.referrer.split('/')[2].split(':')[0]

    return true
  end

  def last_read
    Reference.new(cookies[:last_read], version: current_version) if cookies[:last_read]
  end

  def set_last_read(ref)
    cookies.permanent[:last_read] = ref.to_usfm if ref.try :valid?
  end

  def force_notification_token_or_login
    if params[:token]
      redirect_to sign_out_path(redirect: notifications_path(token: params[:token])) and return if current_user && current_user.notifications_token != params[:token]
    else
      force_login
    end
  end

    def force_login(opts = {})
    if current_auth.nil?
      opts[:redirect] = request.path
      redirect_to sign_up_path(opts) and return
      #EVENTUALLY: handle getting the :source string based on the referrer dynamically in the sign-in controller
    end
    @user = current_user
  end

  def current_auth
    @current_auth ||= Hashie::Mash.new( {'user_id' => cookies.signed[:a], 'username' => cookies.signed[:b], 'password' => cookies.signed[:c]} ) if cookies.signed[:a]
  end

  def current_user
    begin
      @current_user ||= User.find(current_auth) if current_auth
    rescue
      sign_out
      force_login
    end
  end

  def current_username
    User.find(cookies.signed[:a]).username if cookies.signed[:a]
    #TODO: fix this, it's borked
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
        set_current_avatar(avatar_path.gsub('http://static-youversionapi-com.s3-website-us-east-1.amazonaws.com/users/images/','https://d5xlnxqvcdji7.cloudfront.net/users/images/'))
      end

      avatar_path +  cache_bust
    end
  end

  def set_current_avatar(avatar_url)
    cookies.permanent[:avatar] = avatar_url
    # expire header that contains avatar
    expire_fragment "header_#{current_auth.username}_#{I18n.locale}" if current_auth
  end

  def recent_versions
    return @recent_versions if @recent_versions.present?
    return [] if cookies[:recent_versions].blank?

    @recent_versions = cookies[:recent_versions].split('/').map{|v| Version.find(v) rescue nil}.compact.uniq
    # Handle conversion from API2 (osis) to API3 (version_ids)
    # But not a bad idea in general to validate/curate user's recent versions
    cookies[:recent_versions] = @recent_versions.map{|v| v.to_param}.join('/') rescue nil
    @recent_versions
  end

  def current_date
    #PERF: could cache but needs benchmarking if faster than checks to correctly invalidate
    current_user ? (DateTime.now.utc + current_user.utc_date_offset).to_date : Date.today
  end

  def current_version
    return @current_version if @current_version.present?

    @current_version = cookies[:version] || @site.default_version || Version.default_for(params[:locale].try(:to_s) || I18n.default_locale.to_s) || Version.default
    # check to make sure it's a valid version (handling version deprecation)
    @current_version = Version.find(@current_version).to_param rescue Version.default
  end

  def alt_version(ref)
    #Cookie may have empty string for some reason -- possibly previous error case
    cookies[:alt_version] = nil if cookies[:alt_version].blank?

    if cookies[:alt_version].present?
      begin
        # validate that the preferred secondary version has the reference in question
        includes_ref = Version.find(cookies[:alt_version]).include?(ref)
        raise BadSecondaryVersionError unless includes_ref
      rescue
        # bad version was in cookie, nuke it
        cookies[:alt_version] = nil
      end
    end

    return cookies[:alt_version] if cookies[:alt_version].present?

    # new user or bad version was in cookie
    recent = recent_versions.find{|v| v.to_param != current_version && v.include?(ref)}
    cookies[:alt_version] = recent.to_param if recent

    #raise NoSecondaryVersionError if (Version.all(params[:locale] || "en").map(&:to_param)-[current_version]).empty?
    cookies[:alt_version] ||= Version.sample_for((params[:locale] || "en"), except: current_version, has_ref: ref)

    raise NoSecondaryVersionError if cookies[:alt_version].blank?
    cookies[:alt_version]
  end

  def set_current_version(ver)
    cookies.permanent[:version] = ver.to_param
  end

  def verses_in_chapter (ref_hash)
    Version.find(ref_hash[:version]).books[ref_hash[:book].downcase].chapter[ref_hash[:chapter].to_s].verses
  end

  def tend_caches
    @@last_clear_time ||= Time.zone.now

    if @@last_clear_time < 15.minutes.ago
      # Clear all versions, languages, and default versions
      # from memoization caches
      Version.clear_memoization
      @@last_clear_time = Time.zone.now
    end
  end
end
