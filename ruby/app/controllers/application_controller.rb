class ApplicationController < ActionController::Base

  include YV::Concerns::Locale
  include YV::Concerns::Versions
  include YV::Concerns::UserAuth
  include YV::Concerns::Exceptions
  include YV::Concerns::Presenters
  include YV::Concerns::Redirection
  include YV::Concerns::SocialNetworks
  include YV::Concerns::NodeAssets

  include ApplicationHelper
  protect_from_forgery

  helper_method :last_read, :add_node_assets

  before_filter :tend_caches
  before_filter :set_page
  before_filter :set_site
  before_filter :set_locale_and_timezone # from YV::Concerns::Locale
  before_filter :skip_home
  before_filter :check_facebook_cookie   # from YV::Concerns::SocialNetworks
  before_filter :set_default_sidebar     # from YV::Concerns::Presenters
  before_filter :force_redirect_no_auth  # from YV::Concerns::UserAuth

  protected

    # For client, get the last known read reference
    def last_read
      Reference.new( client_settings.last_read , version: current_version) if client_settings.last_read.present?
    end

    # For client, set the currently reading (and therefore last read) reference to the provided ref.
    # Unless this is a ajax request (coming from moments verse request)
    def now_reading(reference)
      client_settings.last_read = reference unless request.xhr?
    end

  private

    def id_param(val)
      val.to_i
    end

    def tend_caches
      @@last_clear_time ||= Time.zone.now

      if @@last_clear_time < Cfg.memoization_cache_expiration.to_f.minutes.ago
        # Clear all versions, languages, and default versions
        # from memoization caches
        Version.clear_memoization
        @@last_clear_time = Time.zone.now
      end
    end

    def set_page
      @page = (params[:page] || 1).to_i
      @labels_page = (params[:labels_page] || 1).to_i
    end

    # Whitelabel sites are configured in /lib/site_configs
    def set_site
      site_class = YV::Sites::Config.sites[request.domain(2)] #allow tld length of two (e.g. '.co.za')
      @site = site_class.new
    end

    def skip_home
      home_page = (params[:controller] == 'pages' && params[:action] == 'home')
      if home_page && (@site.skip_splash || cookies["setting-skip-home"])
        redirect_to( bible_path( last_read || default_reference ))
      end
    end

    def set_cache_headers(maxage)
      if maxage == 'long'
        maxage = 1.days
      elsif maxage == 'short'
        maxage = 8.hours
      end
      expires_in maxage, public: true
    end
end
