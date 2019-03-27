class PingController < ApplicationController

  def ping
    render :nothing => true, :status => 200
  end

end