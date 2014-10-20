json.kind moment.kind
json.object do
#   json.moment_title moment.moment_title
#   json.created_dt   moment.created_dt
#   json.body_text    simple_format(moment.body_text)
#   json.set! :avatar, moment.avatars.lg_avatar.url if moment.avatars.present?
#   json.set! :avatar_style, moment.avatars.style if moment.avatars.present?
#   json.action_url     moment.action_url if moment.action_url.present?
#   unless moment.body_images.nil?
#     json.body_image   moment.body_images.lg.url
#   end
end