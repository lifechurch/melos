module NotesHelper
  
  def versions_dropdown
    return_versions = {}

    Version.versions.each do |k, v|
        return_versions[v.title] = k
    end
    return_versions.sort
  end
end
