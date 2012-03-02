class PagesController < ApplicationController
  def donate
    @donate_link = Bloodhound.bleed_american?(request.env['HTTP_X_FORWARDED_FOR'] || request.remote_ip) ? us_donation_path : "https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=P87AYS9RLXTEE"
  end

  def l10n; end
  def api_timeout; end
  def about; end
  def press; end
  def mobile; end
  
  def open
    render json: 10.to_json, callback: params[:callback]
  end
end
