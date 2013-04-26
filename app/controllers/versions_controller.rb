class VersionsController < ApplicationController

  def index
    @versions_by_lang = Version.all_by_language({:only => @site.versions})
    primary_locale = Version.find(params[:context_version]).language.tag rescue nil if params[:context_version].present?
    primary_locale ||= I18n.locale.to_s
    primary_locale = "en" if primary_locale == "en-GB" #TODO fix.this.hack
    cur_lang = Hash[primary_locale, @versions_by_lang.delete(primary_locale)]
    @versions_by_lang = cur_lang.merge(@versions_by_lang)
    self.sidebar_presenter = Presenter::Sidebar::Versions.new(@versions_by_lang,params,self)
  end

  def show
    @version = Version.find(params[:id])
    @related = Version.all_by_publisher[@version.publisher_id].find_all{|v| v.language.tag == @version.language.tag}
    @related = @related - [@version] if @related
    self.sidebar_presenter = Presenter::Sidebar::Version.new(@version,params,self)
  end
end
