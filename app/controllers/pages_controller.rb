class PagesController < ApplicationController

  before_filter :force_login, only: [:donate]

  def mobile;       end
  def status;       end
  def api_timeout;  end
  def generic_error;end

  def feed;end
  def notifications;end
  def requests;end
  def intro;end

  # /app url - redirects to an store for mobile device if found
  # tracks requests to /app to GA custom event.
  def app
    tracker = Gabba::Gabba.new(@site.ga_code, @site.ga_domain)
    tracker.identify_user(cookies[:__utma], cookies[:__utmz])
    tracker.event("App Download", "#{request.host_with_port}#{request.fullpath}")
    return redirect_store! unless request.env["X_MOBILE_DEVICE"].nil?
  end

  def about
    expires_in 30.days, public: true
  end

  def press
    expires_in 30.days, public: true
  end

  def privacy
    expires_in 30.days, public: true
    @locale = :en unless i18n_terms_whitelist.include? I18n.locale
  end

  def terms
    expires_in 30.days, public: true
    @locale = :en unless i18n_terms_whitelist.include? I18n.locale
  end

  def routing_error
    page = bdc_user? ? 'pages/bdc_home' : 'pages/error_404'
    render page, status: 404
  end

  def header
    render "shared/header/_header_auth", layout: false
  end

  def error_404
    render "pages/error_404", status: 404 and return
  end

  def i18n_terms_whitelist
    # the following localizations have the legal terms reviewed in a way that is
    # legally appropriate to show in a localized state
    [ :da, :en, :ja, :lv, :sv, :vi, :nl, :"pt", :"no", :"zh-CN",
      :"zh-TW", :ms, :ru, :ro, :"es-ES", :uk, :ko ]
  end

  def donate
    if params[:err].present?
      begin
        raise TreadstoneAuthenticationError, "Treadstone Authentication Error: (Message: #{params[:err]}) "
      rescue TreadstoneAuthenticationError => e
        Raven.capture_exception(e)
      end
      return render :generic_error
    else
      user = current_user

      # language tags do not always match the list of available locales we are passing locale
      # so that the donate site can match the language the user was in on bible.com when they clicked 'donate'
      ts_payload = {
          created: Time.now.to_i.to_s,
          email: user.email,
          first_name: user.first_name.blank? ? "" : user.first_name,
          id: user.id.to_s,
          language_tag: I18n.locale.to_s,
          last_name: user.last_name.blank? ? "" : user.last_name,
          source: 'youversion'
      }

      ts_signature = Licenses::Request.sign( ts_payload , ENV["TREADSTONE_SECRET"] ) unless ENV["TREADSTONE_SECRET"].nil?
      ts_payload[:signature] = ts_signature
      @ts_url = Cfg.treadstone_base_url + "?" + ts_payload.to_query
      return redirect_to @ts_url
    end
  end

  def trending
    @trending_verses = Trending.all()
  end

end
