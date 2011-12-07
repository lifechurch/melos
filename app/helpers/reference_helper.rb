module ReferenceHelper

  def link_to_references(refs)
#     Rails.logger.info("In link_to_references, refs is a #{refs.class} of size #{refs.size}")
#     Rails.logger.info("...and first looks like [#{refs.first.class}]")
#     Rails.logger.info("...and it looks like [#{refs}]")
#     Rails.logger.info("Also, caller looks like this: #{caller[0]}")
    case refs
    when Array
      refs.map { |r| link_to(r, bible_path(r))}.join(", ").html_safe
    when Reference
      link_to(refs, bible_path(refs))
    end
  end
end
