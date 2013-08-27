class VideosController < ApplicationController

  respond_to :html
  before_filter :check_locale

  rescue_from YV::ResourceError, with: :resource_error

  def index
    @videos = Video.search("*",language_tag: I18n.locale.to_s)
    respond_with(@videos)
  end

  def series
    opts = current_auth ? {auth: current_auth, force_auth: true} : {}
    @video = Video.find(params[:id], opts )
    client_settings.video_series = @video.id
    respond_with(@video)
  end

  def show
    opts = current_auth ? {auth: current_auth, force_auth: true} : {}
    @video = Video.find(params[:id], opts )
    redirect_to(series_video_path(@video)) and return if @video.series?
    respond_with(@video)
  end

  def publisher
    @video = Video.find params[:id]
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

end