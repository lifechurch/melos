json.id             moment.id
json.created_dt     moment.created_dt
json.updated_dt     moment.updated_dt
json.moment_title   moment.moment_title
json.references     moment.references

json.user do
  json.id           moment.user_id
  json.user_name    moment.user_name
end

json.comments do
  
  json.commenting    moment.commenting
  json.count         moment.comments_count
  
  json.array! moment.comments do |comment|

    json.id          comment.id
    json.content     comment.content
    json.created_dt  comment.created_dt

    json.user do
      user    = comment.user
      avatar  = user.avatars.md_avatar.url
      json.id           user.id
      json.avatar       avatar
      json.name         user.name
      json.user_name    user.username
    end
    
  end
end

json.likes do
  
  json.liking        moment.liking
  json.count         moment.likes_count
  json.user_ids      moment.likes_user_ids

  json.array! moment.likes do |like|
    
    json.created_dt  like.created_dt
    
    json.user do
      user    = like.user
      avatar  = user.avatars.md_avatar.url
      json.id           user.id
      json.avatar       avatar
      json.name         user.name
      json.user_name    user.username
    end

  end
end