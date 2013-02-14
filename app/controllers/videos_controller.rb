class VideosController < ApplicationController

  respond_to :html

  def index
    @videos = Video.search
    respond_with(@videos)
  end

  def series
    @video = Video.find params[:id]
    respond_with(@video)
  end

  def show
    @video = Video.find params[:id]
    respond_with(@video)
  end

  def publisher
    @video = Video.find params[:id]
    @publisher = @video.publisher
    respond_with(@publisher)
  end

end