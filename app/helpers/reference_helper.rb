module ReferenceHelper

  def link_to_references(refs)
  # Rails.logger.apc "In link_to_references, refs is a #{refs.class} of size #{refs.size}"
  # Rails.logger.apc "...and first looks like [#{refs.first.class}]"
  # Rails.logger.apc "...and it looks like [#{refs}]"
  # Rails.logger.apc "Also, caller looks like this: #{caller[0]}"
    case refs
    when Reference
      link_to(refs, bible_path(refs))
    else
      refs.map { |r| link_to(r, bible_path(r))}.join(", ").html_safe
    end
  end
end
