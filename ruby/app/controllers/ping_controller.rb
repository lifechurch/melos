class PingController < ApplicationController

  def ping
    render :nothing => true, :status => 200
  end

  def ping_all
    nodejsHost = "http://#{Cfg.nodejs_api_host}"

    if Cfg.nodejs_api_port.present?
      nodejsHost = "#{nodejsHost}:#{Cfg.nodejs_api_port}"
    end

    begin
    curl = Curl::Easy.new
    curl.url = "#{nodejsHost}/running"
    curl.timeout = Cfg.api_default_timeout.to_f
    curl.perform
    render :nothing => true, :status => curl.response_code

    rescue Exception => e
      render :nothing => true, :status => 500

    end
  end

  def running
    if File.exist?('/tmp/disable.txt')
      render :nothing => true, :status => 404
    else
      render :nothing => true, :status => 200
    end
  end
  
end