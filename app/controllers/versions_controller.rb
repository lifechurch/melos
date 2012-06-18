class VersionsController < ApplicationController

  def index
    @versions_by_lang = Version.all_by_language
  end

  def show
    @version = Version.find(params[:id])
  end
end
