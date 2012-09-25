class VersionsController < ApplicationController

  def index
    @versions_by_lang = Version.all_by_language
    cur_lang = Hash[I18n.locale.to_s, @versions_by_lang.delete(I18n.locale.to_s)]
    @versions_by_lang = cur_lang.merge(@versions_by_lang)
  end

  def show
    @version = Version.find(params[:id])

    @related = Version.all_by_publisher[@version.publisher.id].find_all{|v| v.language.tag == I18n.locale.to_s}
    @related = @related - [@version] if @related
  end
end
