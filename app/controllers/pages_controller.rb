class PagesController < ApplicationController
  helper_method :localized_bible_icon

  def donate
    @us_donate_link = us_donation_path
    @intl_donate_link = "https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=P87AYS9RLXTEE"
  end

  def l10n; end
  def api_timeout; end
  def about; end
  def press; end
  def mobile; end

  def tracking
    analytics_id = "UA-351257-4" #YouVersion GA ID.
    tracker = Gabba::Gabba.new(analytics_id, "youversion.com")
    tracker.event("Download", "Request", "page", "/test", true)
    redirect_to("/mobile")
  end


  def privacy
    @mobile = env["X_MOBILE_DEVICE"].present?
    I18n.locale = :en unless i18n_terms_whitelist.include? I18n.locale
    render action: "privacy", layout: "application"
  end

  def terms
    @mobile = env["X_MOBILE_DEVICE"].present?
    I18n.locale = :en unless i18n_terms_whitelist.include? I18n.locale
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

  def localized_bible_icon
    # the following localizations have a 50x50 or slightly larger
    # asset localized. Add a new code here if you have
    # added the image asset as named below
    if [:km, :af, :ar, :nl, :en, :tl, :fi, :fr, :de, :hu,
        :ko, :ms, :no, :pl, :"pt-BR", :"pt-PT", :ro, :ru,
        :"zh-CN", :sk, :es, :sv, :"zh-TW", :uk, :bg, :ca,
        :"en-GB", :"es-ES", :hi, :id, :it, :ja, :mk, :mn,
        :sq, :tr, :vi, :cs].include? I18n.locale
      "Bible-app-icon-#{I18n.locale}-small.png"
    end
  end
end
