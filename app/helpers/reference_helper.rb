module ReferenceHelper
  def link_to_references(refs)
    case refs
    when Array
      refs.map { |r| link_to(r, bible_path(r))}.join(", ").html_safe
    when Reference
      link_to(refs, bible_path(refs))
    end
  end
end
