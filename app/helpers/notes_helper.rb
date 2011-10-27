module NotesHelper
  
  def versions_dropdown
    return_versions = {}

    Version.versions.each do |k, v|
        return_versions[v.title] = k
    end
    return_versions.sort
  end
  
  #def references_breakout(refs, version)
  #  return_refs = ""
  #  if refs
      
  #    refs.each do |ref|
  #      return_refs << link_to("#{ref.human} (#{version.upcase})", "/bible/#{ref.osis}")
  #    end
  #    raw(return_refs)
        
  #  else
  #    ''
  #  end
  #end
  
end
