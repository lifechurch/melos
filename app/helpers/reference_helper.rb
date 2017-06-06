module ReferenceHelper

  def link_to_references(refs)
    case refs
    when Reference
      link_to(refs, bible_path(refs))
    else
      refs.map { |r| link_to(r, bible_path(r))}.join(", ").html_safe
    end
  end
end
