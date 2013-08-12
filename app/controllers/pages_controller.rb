class PagesController < ApplicationController

  def about;        end
  def press;        end
  def mobile;       end
  def donate;       end
  def api_timeout;  end

  # /app url - redirects to an store for mobile device if found
  # tracks requests to /app to GA custom event.
  def app
    tracker = Gabba::Gabba.new(@site.ga_code, @site.ga_domain)
    tracker.identify_user(cookies[:__utma], cookies[:__utmz])
    tracker.event("App Download", "#{request.host_with_port}#{request.fullpath}")
    return redirect_store! unless request.env["X_MOBILE_DEVICE"].nil?
  end


  def privacy
    @mobile = env["X_MOBILE_DEVICE"].present?
    @locale = :en unless i18n_terms_whitelist.include? I18n.locale
    render action: "privacy", layout: "application"
  end

  def terms
    @mobile = env["X_MOBILE_DEVICE"].present?
    @locale = :en unless i18n_terms_whitelist.include? I18n.locale
    render action: "terms", layout: "application"
  end

  def open
    render json: 10.to_json, callback: params[:callback]
  end

  def generic_error
  end

  def status; end
  def sleep_me
    sleep(params[:time].to_i)
    render text: "I'm awake now"
  end

  def routing_error
    if bdc_user?
      render 'pages/bdc_home', status: 404
    else
      render 'pages/error_404', status: 404
    end
  end

  private

  def i18n_terms_whitelist
    # the following localizations have the legal terms reviewed in a way that is
    # legally appropriate to show in a localized state
    [ :en, :sv, :ja, :vi, :nl, :"pt-BR", :"no", :"zh-CN",
      :"zh-TW", :ms, :ru, :ro, :"es-ES", :uk ]
  end


  # Rules for redirecting to App Store(s) given the mobile device user agent string

  def redirect_store!

    store_url = case request.env["X_MOBILE_DEVICE"] #rack_env["X_MOBILE_DEVICE"]

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
        'https://www.bible.com'
    end

    redirect_to( store_url )
  end


end
