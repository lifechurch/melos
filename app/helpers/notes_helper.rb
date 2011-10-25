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

    if refs
      refs.each do |ref|
        return_refs << ref.human
      end
      return_refs
    else
      ''
    end
  end
  
  def references_link_breakout(refs)
    return_refs = ""

    if refs
      refs.each do |ref|
        return_refs << link_to(ref.human, '/format_for_verses/' << ref.osis) #TODO: Complete
      end
      raw(return_refs)
    else
      ''
    end
  end  
end
