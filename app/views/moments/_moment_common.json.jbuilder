json.id             moment.id
json.created_dt     moment.created_dt
json.updated_dt     moment.updated_dt
json.references     moment.references
json.path           moment.to_path
json.avatar         moment.avatars.lg_avatar.url
json.set! :owned_by_me, current_user_moment?(moment)
json.actions do
  json.set! :show, moment.comments_count > 3 || moment.likes_count > 0
  json.set! :editable, (current_user_moment?(moment) and moment.editable?)
  json.set! :deletable, (current_user_moment?(moment) and moment.deletable?)
end

json.user do
  json.id           moment.user_id
  json.user_name    moment.user_name
  json.set!         :path, "/users/#{moment.user_name}"         
end

json.comments do
  
  json.enabled       moment.commenting
  json.count         moment.comments_count
  json.strings do
    if moment.comments_count > 3
      json.view_all_comments   t("comments.view all N", count: moment.comments_count)
    end
  end

  json.all do
    json.array! moment.comments do |comment|
      json.id          comment.id
      json.content     comment.content
      json.created_dt  comment.created_dt
      json.set! :owned_by_me, comment.user.id == current_auth.user_id  #necessary for js templates.

      json.user do
        user    = comment.user
        avatar  = user.avatars.md_avatar.url
        json.id           user.id
        json.avatar       avatar
        json.name         user.name
        json.user_name    user.username
        json.path         user.to_path
      end
    end
  end
end

json.likes do
  
  json.enabled       moment.liking
  json.count         moment.likes_count
  json.user_ids      moment.likes_user_ids

  json.strings do
    if moment.likes_count > 0
      json.whos_liked  moment_whos_liked_string(moment)
    end
  end

  json.all do
    json.array! moment.likes do |like|
      
      json.created_dt  like.created_dt
      
      json.user do
        user    = like.user
        avatar  = user.avatars.md_avatar.url
        json.id           user.id
        json.avatar       avatar
        json.name         user.name
        json.user_name    user.username
        json.path         user.to_path
      end

    end
  end
end