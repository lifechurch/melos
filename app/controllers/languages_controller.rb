class LanguagesController < ApplicationController

  def index
    @versions_by_lang = Version.all_by_language({:only => @site.versions})
  end

  def show
    @language = params[:id]
    @versions_by_lang = Version.all_by_language({:only => @site.versions})
  end
end
