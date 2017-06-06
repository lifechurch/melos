moment_title = (logged_in? and current_user_moment? @moment and @moment.attributes.has_key?("references") and @moment.references.respond_to?(:collect)) ? @moment.references.collect {|r| r.human}.join(", ") : @moment.moment_title.html_safe

json.array! [@moment] do
  json.set! :kind,      @moment.kind
  json.partial! @moment.moment_partial_path, moment: @moment
end