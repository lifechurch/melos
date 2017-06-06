class AudiobiblesController < ApplicationController

  before_filter -> { set_cache_headers 'short' }, only: [:index]
  before_filter -> { set_cache_headers 'long' }, only: [:show]

  def index
    @versions_by_lang = Version.all_by_language({:only => @site.versions, :audio => true})
    primary_locale = Version.find(params[:context_version]).language.tag rescue nil if params[:context_version].present?
    primary_locale ||= I18n.locale.to_s
    primary_locale = "en" if primary_locale == "en-GB" #TODO fix.this.hack
    primary_locale = "pt-BR" if primary_locale == "pt"
    cur_lang = Hash[primary_locale, @versions_by_lang.delete(primary_locale)]
    @versions_by_lang = cur_lang.merge(@versions_by_lang)
    self.sidebar_presenter = Presenter::Sidebar::Versions.new(@versions_by_lang,params,self)
  end

  def show
    @version = Version.find(params[:id])
    ref_string = YV::ReferenceString.new("mat.5", overrides: {version: @version.id})
    @reference = Reference.new(ref_string)
  end
end
