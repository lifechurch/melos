class VersionsController < ApplicationController

  def index
    @versions_by_lang = Version.all_by_language
    primary_locale = Version.find(params[:context_version]).language.tag rescue nil if params[:context_version].present?
    primary_locale ||= I18n.locale.to_s
    cur_lang = Hash[primary_locale, @versions_by_lang.delete(primary_locale)]
    @versions_by_lang = cur_lang.merge(@versions_by_lang)
  end

  def show
    @version = Version.find(params[:id])

    @related = Version.all_by_publisher[@version.publisher_id].find_all{|v| v.language.tag == @version.language.tag}
    @related = @related - [@version] if @related
  end
end
