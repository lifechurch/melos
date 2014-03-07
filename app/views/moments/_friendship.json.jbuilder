json.set! :kind, "friendship"
json.object do
  json.avatar         moment.avatars.lg_avatar.url
  json.created_dt     moment.created_dt
  json.moment_title   moment.moment_title
  
  json.set! :friend_path, "/users/#{moment.friend.user_name}"
  json.friend_name    moment.friend.name
  json.friend_avatar  moment.friend.avatars.lg_avatar.url
end