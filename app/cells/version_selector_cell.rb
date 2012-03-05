class VersionSelectorCell < Cell::Rails
  include ApplicationHelper
  helper_method :bible_path

  cache :display do |cell, opts|
    puts "version selector cache key is #{@this_language}_#{@recent_versions}"
    "#{@this_language}_#{@recent_versions}"
  end

  def display(opts ={})
    if opts[:reference]
      @reference = opts[:reference]
      @version = opts[:version] || Version.find(@reference[:version])
      @alt_version = (!opts[:alt_reference] || opts[:alt_reference][:version] == @reference[:verson]) ? @version : Version.find(opts[:reference][:version]) #optimized for common case of no alt_version
    elsif opts[:version]
      @version = opts[:version]
      @alt_version = @version
    end
    
    @all_languages = Version.all_by_language
    @this_language = @all_languages[@version.language.iso]
    @all_languages = @all_languages.except(@version.language.iso)
    @languages = Version.languages
    @force_style = opts[:force_style]
    @params = opts[:link_params]
    @recent_versions = opts[:recent_versions] || []
    render
  end

end
