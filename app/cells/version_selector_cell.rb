class VersionSelectorCell < Cell::Rails
  include ApplicationHelper
  helper_method :bible_path

  def display(opts ={})
    if opts[:reference]
      @reference = opts[:reference]
      @version = Version.find(@reference[:version])
    elsif opts[:version]
      @version = opts[:version]
    end
    @all_languages = Version.all_by_language
    @this_language = @all_languages[@version.language.iso]
    @all_languages = @all_languages.except(@version.language.iso)
    @languages = Version.languages
    render
  end

end
