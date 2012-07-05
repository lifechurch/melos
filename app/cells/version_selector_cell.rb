class VersionSelectorCell < Cell::Rails
  include ApplicationHelper
  helper_method :bible_path
  cache :all_versions, :expires_in => 6.hours do |cell, opts|
      "#{opts[:version].language.id}_#{opts[:site]}"
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

    @all_languages = Version.all_by_language(only: @site.versions)
    @this_language = @all_languages[@version.language.tag]
    @all_languages = @all_languages.except(@version.language.tag)
    @languages = Version.languages
    render
  end

  private

  def get_opts(opts ={})
    @site = opts[:site]
    @ref = opts[:reference]
    @version = opts[:version]
    @is_alt = opts[:is_alt] || false
    @link_params = opts[:link_params]
  end

end
