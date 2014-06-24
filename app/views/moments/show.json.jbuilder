moment_title = @moment.moment_title.html_safe

json.array! [@moment] do
  json.set! :kind,      @moment.kind
  json.partial! @moment.moment_partial_path, moment: @moment
end