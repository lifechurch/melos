json.set! :kind, "bookmark"
json.object do
  json.labels do
    json.array! moment.labels
  end
  json.partial! "moment_common", moment: moment
end