class VideosController < ApplicationController

  include YV::Concerns::Exceptions
  respond_to :html
  prepend_before_filter :mobile_redirect, only: [:index, :show, :series] 
  before_filter :check_locale
  before_filter -> { set_cache_headers 'short' }, only: [:index, :series]
  before_filter -> { set_cache_headers 'long' }, only: [:show, :publisher]

  rescue_from YV::ResourceError, with: :resource_error

  def index
    @videos = Video.search("*",language_tag: I18n.locale.to_s)
    respond_with(@videos)
  end

  def series
    opts = current_auth ? {auth: current_auth, force_auth: true} : {}
    @video = Video.find(params[:id].to_i, opts )
    client_settings.video_series = @video.id
    respond_with(@video)
  end

  def show
    opts = current_auth ? {auth: current_auth, force_auth: true} : {}
    @video = Video.find(params[:id].to_i, opts )
    @video_url = video_url(@video)
    return render_404 if @video.errors.present?
    return redirect_to(series_video_path(@video)) if @video.series?
    respond_with(@video)
  end

  def publisher
    @video = Video.find(params[:id].to_i)
    return render_404 if @video.errors.present?
    @publisher = @video.publisher
    respond_with(@publisher)
  end

  private

  def check_locale
    unless Video.available_locales.include? I18n.locale
      render_404
    end
  end

  def resource_error(exception)
    if exception.message == "videos.video.not_found"
      render_404
    end
  end

  def video_url(video)
      case request.env["X_MOBILE_DEVICE"]
        when /android|Android/
          video.webm.url
        else
          video.hls.url
      end
  end
end