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
  
  def open
    render json: 10.to_json, callback: params[:callback]
  end
  
  def status; end
end
