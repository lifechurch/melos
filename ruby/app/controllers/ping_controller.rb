class PingController < ApplicationController

  def ping
    render :nothing => true, :status => 200
  end

  def running
    if File.exist?('/tmp/disable.txt')
      render :nothing => true, :status => 404
    else
      render :nothing => true, :status => 200
    end
  end
  
end