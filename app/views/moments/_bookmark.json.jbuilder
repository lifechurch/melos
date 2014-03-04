json.set! :kind, "bookmark"
json.object do
  json.partial! "moment_common", moment: moment
end