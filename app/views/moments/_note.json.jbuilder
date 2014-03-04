json.set! :kind, "note"
json.object do
  json.title    moment.title
  json.content  moment.content
  json.status   moment.user_status
  json.partial! "moment_common", moment: moment
end