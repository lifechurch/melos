class VersionsController < ApplicationController

  def index
    @versions = Version.all_by_language
    @languages = Version.languages
  end

  def show
    @version = Version.find(params[:id])
  end
end
