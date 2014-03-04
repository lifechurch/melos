json.set! :kind, "generic"
json.object do
  json.moment_title moment.moment_title
  json.created_dt   moment.created_dt
  json.body_text    moment.body_text
  json.body_images  moment.body_images
end