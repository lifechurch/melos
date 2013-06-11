class PagesController < ApplicationController

  def donate
    @us_donate_link = us_donation_path
    @intl_donate_link = "https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=P87AYS9RLXTEE"
  end

  def l10n; end
  def api_timeout; end
  def about; end
  def press; end
  def mobile; end

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
end
