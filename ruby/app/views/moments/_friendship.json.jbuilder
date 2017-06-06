json.set! :kind, "friendship"
json.object do
  json.avatar         moment.avatars.lg_avatar.url
  json.created_dt     moment.created_dt
  json.moment_title   moment.moment_title
  json.set! :time_ago, api_dt_time_ago(moment.created_dt)  
  json.set! :friend_path, "/users/#{moment.friend.user_name}"
  json.friend_name    moment.friend.name
  json.friend_avatar  moment.friend.avatars.lg_avatar.url

  json.partial!   "/moments/moment_common", moment: moment
  
  # This is all logic to determine whether to show the add friend button.
  # TODO: refactor, move out to helper/model/mapper
  pending_friendship = Friendships.pending_type_for(moment.friend.id, auth: current_auth)
  friends_with = Friend.with?(moment.friend.id, auth: current_auth)
  if (friends_with.blank?) && ( pending_friendship.blank? ) && ( moment.user.id != moment.friend.id ) && ( moment.user.id != current_user.id ) && ( moment.friend.id != current_user.id )
    json.set! :friendship_offer_path, "/friendships/offer?user_id=#{moment.friend.id}"
  end
end