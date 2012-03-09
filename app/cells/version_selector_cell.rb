class VersionSelectorCell < Cell::Rails
  include ApplicationHelper
  helper_method :bible_path
  cache :all_versions do |cell, opts|
      opts[:version].language.iso
  end

  #version and recent_versions expected as version and array of versions. alt is bool
  #opts[:force_style] is temporary parameter until we have new reading plan design
  #opts[:link_params] is temporary parameter until we have new reading plan design
  
  def display(opts ={})
    get_opts opts
    
    @recent_versions = opts[:recent_versions] || []
    @force_style = opts[:force_style]
    render
  end
  
  def all_versions(opts = {})
    get_opts opts
    
    @all_languages = Version.all_by_language
    @this_language = @all_languages[@version.language.iso]
    @all_languages = @all_languages.except(@version.language.iso)
    @languages = Version.languages
    render
  end
  
  private
  
  def get_opts(opts ={})
    @ref = opts[:reference]
    @version = opts[:version]
    @is_alt = opts[:is_alt] || false
    @link_params = opts[:link_params]
    puts "BLAMO 1"
  end

end
