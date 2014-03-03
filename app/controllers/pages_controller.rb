class PagesController < ApplicationController

  def about;        end
  def press;        end
  def mobile;       end
  def donate;       end
  def status;       end
  def api_timeout;  end
  def generic_error;end

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

  def i18n_terms_whitelist
    # the following localizations have the legal terms reviewed in a way that is
    # legally appropriate to show in a localized state
    [ :da, :en, :ja, :lv, :sv, :vi, :nl, :"pt-BR", :"no", :"zh-CN",
      :"zh-TW", :ms, :ru, :ro, :"es-ES", :uk, :ko ]
  end

end
