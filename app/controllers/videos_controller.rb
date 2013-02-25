class VideosController < ApplicationController

  respond_to :html

  rescue_from YouVersion::ResourceError, with: :resource_error

  def index
    @videos = Video.search
    respond_with(@videos)
  end

  def series
    opts = current_auth ? {auth: current_auth, force_auth: true} : {}
    @video = Video.find(params[:id], opts )
    respond_with(@video)
  end

  def show
    opts = current_auth ? {auth: current_auth, force_auth: true} : {}
    @video = Video.find(params[:id], opts )
    respond_with(@video)
  end

  def publisher
    @video = Video.find params[:id]
    @publisher = @video.publisher
    respond_with(@publisher)
  end

  private

  def resource_error(exception)
    if exception.message == "videos.video.not_found"
      render_404
    end
  end

end