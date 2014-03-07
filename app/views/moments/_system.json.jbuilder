json.set! :kind, "system"
json.object do
  json.created_dt   moment.created_dt
  json.body         moment.body
  json.title        moment.title
end