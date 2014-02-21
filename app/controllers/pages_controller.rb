class PagesController < ApplicationController

  def about;        end
  def press;        end
  def mobile;       end
  def donate;       end
  def status;       end
  def api_timeout;  end
  def generic_error;end

  # /app url - redirects to an store for mobile device if found
  # tracks requests to /app to GA custom event.
  def app
    track_app_download
    return redirect_to store_path(request.env["X_MOBILE_DEVICE"]) unless request.env["X_MOBILE_DEVICE"].nil?
  end
  end

  def privacy
    @locale = :en unless i18n_terms_whitelist.include? I18n.locale
  end

  def terms
    @locale = :en unless i18n_terms_whitelist.include? I18n.locale
  end

  def routing_error
    page = bdc_user? ? 'pages/bdc_home' : 'pages/error_404'
    render page, status: 404
  end

  def error_404
    render "pages/error_404", status: 404 and return
  end

  private

  def track_app_download
    tracker = Gabba::Gabba.new(@site.ga_code, @site.ga_domain)
    tracker.identify_user(cookies[:__utma], cookies[:__utmz])
    tracker.event("App Download", "#{request.host_with_port}#{request.fullpath}")
  end

  def i18n_terms_whitelist
    # the following localizations have the legal terms reviewed in a way that is
    # legally appropriate to show in a localized state
    [ :da, :en, :ja, :lv, :sv, :vi, :nl, :"pt-BR", :"no", :"zh-CN",
      :"zh-TW", :ms, :ru, :ro, :"es-ES", :uk, :ko ]
  end


  # Rules for redirecting to App Store(s) given the mobile device user agent string

  def store_path(device=nil)

    case device #rack_env["X_MOBILE_DEVICE"]

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
        
      when /Windows 8/
        'http://apps.microsoft.com/webpdp/app/bible/af5f6405-7860-49a9-a6b4-a47381974e1d'

      else
        'https://www.bible.com'
    end

  end


end
