json.set! :kind, "system"
json.object do
  json.moment_title moment.moment_title
  json.created_dt   moment.created_dt
  json.body_text    simple_format(moment.body_text)
  unless moment.body_images.nil?
    json.body_image   moment.body_images.lg.url
  end
end