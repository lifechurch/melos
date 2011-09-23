class VersionsController < ApplicationController

  def index
  end

  def show
    @version = Version.find(params[:id])
  end
end
