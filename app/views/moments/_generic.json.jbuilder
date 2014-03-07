json.set! :kind, "generic"
json.object do
  json.moment_title moment.moment_title
  json.created_dt   moment.created_dt
  json.body_text    moment.body_text
  json.body_images  moment.body_images
  json.avatar       moment.avatars.lg_avatar.url

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
end