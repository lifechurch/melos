class VersionsController < ApplicationController

  before_filter -> { set_cache_headers 'short' }, only: [:index]
  before_filter -> { set_cache_headers 'long' }, only: [:show]
  prepend_before_filter :mobile_redirect, only: [:show]

  def index
    @versions_by_lang = Version.all_by_language({:only => @site.versions})
    primary_locale = Version.find(params[:context_version]).language.id rescue nil if params[:context_version].present?
    primary_locale ||= YV::Conversions.to_bible_api_lang_code(I18n.locale.to_s)
    primary_locale = "eng" if YV::Conversions.bible_to_app_lang_code(primary_locale) == "en-GB" #TODO fix.this.hack
    primary_locale = YV::Conversions.to_bible_api_lang_code("pt-BR") if YV::Conversions.bible_to_app_lang_code(primary_locale) == "pt"
    cur_lang = Hash[primary_locale, @versions_by_lang.delete(primary_locale)]

    if params[:single_locale].present?
      @versions_by_lang = cur_lang
    else
      @versions_by_lang = cur_lang.merge(@versions_by_lang)
    end

    self.sidebar_presenter = Presenter::Sidebar::Versions.new(@versions_by_lang,params,self)

    if params[:single_locale].present?
      render 'index-single-locale'
    end
  end

  def show
    respond_to do |format|
      format.json {
        key = "json-single-version-rabl-#{params[:id]}"
        keyExists = Rails.cache.fetch(key, expires_in: YV::Caching.a_very_long_time)
        if !keyExists
          @version = Version.get("bible/version", {id: params[:id], cache_for: YV::Caching.a_very_long_time })
          json = render_to_string json: @version
          Rails.cache.write(key, json)
          return render :json => json
        else
          return render :json => Rails.cache.read(key)
        end
      }

      format.any {
        @version = Version.find(params[:id])
        @related = Version.all_by_publisher[@version.publisher_id].find_all{|v| v.language.tag == @version.language.tag}
        @related = @related - [@version] if @related

        if params[:returnTo].present?
          reference_parts = params[:returnTo].split(".")
          @returnTo = Reference.new(book: reference_parts[0], chapter: reference_parts[1], version: params[:id])
        end

        self.sidebar_presenter = Presenter::Sidebar::Version.new(@version,params,self)
        return
      }
    end
  end
end
