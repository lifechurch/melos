class VersionSelectorCell < Cell::Rails


  #version and recent_versions expected as version and array of versions
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
    @this_language = Version.all_by_language(only: @site.versions)[@version.language.tag]
    render
  end

  private

  def get_opts(opts ={})
    @site = opts[:site]
    @ref = opts[:reference]
    @version = opts[:version]
    @link_params = opts[:link_params]
    @add_version_param = opts[:add_version_param] || false
    @presenter = opts[:presenter]
  end

end
