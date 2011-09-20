class VersionSelectorCell < Cell::Rails

  def display(opts ={})
    @reference  = opts[:reference]
    @versions  = Version.all_by_language
    @languages = Version.languages
    render
  end

end
