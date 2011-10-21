module NotesHelper
  
  def versions_dropdown
    return_versions = {}

    Version.versions.each do |k, v|
        return_versions[v.title] = k
    end
    return_versions.sort
  end
  
  def references_breakout(refs)
    return_refs = ""
    
    refs.each do |ref|
      return_refs << ref.human
    end
    return_refs
  end
end
