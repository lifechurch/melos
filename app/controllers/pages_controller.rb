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

  def generic_error
  end

  def status; end
  def sleep_me
    sleep(params[:time].to_i)
    render text: "I'm awake now"
  end


  def routing_error
    render 'pages/error_404'
  end
end
