json.kind           moment.kind
json.object do
  json.moment_title   moment.moment_title
  json.body_image     moment.image
  json.partial!       "/moments/moment_common", moment: moment
  json.action_url     moment.action_url
end