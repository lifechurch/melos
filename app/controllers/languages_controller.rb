class LanguagesController < ApplicationController

  def index
    @versions_by_lang = Version.all_by_language({:only => @site.versions})
  end

  def show
    @language = params[:id]
    @versions_by_lang = Version.all_by_language({:only => @site.versions})
    @versions_by_lang.each do |lang, versions|
      if versions.present?
        if versions.first.attributes.language.language_tag.eql?(@language.to_s)
          @language_name = versions.first.attributes.language.local_name
          @language_name = "#{@language_name} - #{versions.first.attributes.language.name}" if (versions.first.attributes.language.name.present? and not (@language_name.eql?(versions.first.attributes.language.name)))
        end
      end
    end
  end
end
