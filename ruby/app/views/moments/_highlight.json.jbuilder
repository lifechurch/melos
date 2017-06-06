json.set! :kind, "highlight"

json.object do
  json.set! :moment_title,   moment.moment_title
  json.partial! "/moments/moment_common", moment: moment
end