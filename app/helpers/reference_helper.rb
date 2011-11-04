module ReferenceHelper
  def link_to_references(refs)
    refs.map { |r| link_to(r, bible_path(r))}.join(", ").html_safe
  end
end
