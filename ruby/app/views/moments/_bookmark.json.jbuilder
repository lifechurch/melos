json.set! :kind, "bookmark"

json.object do
  json.moment_title   moment.moment_title
  json.labels do
    json.array! moment.labels
  end
  json.partial!   "/moments/moment_common", moment: moment
  json.next_cursor moment.next_cursor
end