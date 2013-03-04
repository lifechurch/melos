class TrackingsController < ApplicationController

  def app
    Gabba::Gabba.new('UA-3571547-76','youversion.com').event("Bible.com", "navigate", "page", "/app", true)
    redirect_to("http://www.youversion.com/download")
  end

end