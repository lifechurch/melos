class VersionSelectCell < Cell::Rails

  def display(opts ={})
    @selected  = opts[:selected]
    @versions  = Version.all_by_language
    @languages = Version.languages
    render
  end

end
