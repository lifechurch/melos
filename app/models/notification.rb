# New API introduced in 3.1 for social
# Implements a subset of Notifications API - (#all, #update)
# http://developers.youversion.com/api/docs/3.1/sections/notifications.html

# - #settings and #update_settings are implemented in NotificationSettings model



# Custom types and extras data
# ----------------------------------------------------------------------------------------

# "id"=>"notifications.friendships.offer.v1"}
# 
# "extras"=>
#   {"custom_actions"=>["accept", "decline"],
#     "friendships_offer"=>
#      {"user"=>
#        {"username"=>"BrittTheTester", "id"=>7464, "name"=>"Britt Tester"}}}

# "id"=>"notifications.friendships.accept.v1"}
# 
# "extras"=>
#   {"friendships_accept"=>
#     {"user"=>
#       {"username"=>"BrittTheTester", "id"=>7464, "name"=>"Britt Tester"}}},

# ----------------------------------------------------------------------------------------


class Notification < YV::Resource

  api_response_mapper YV::API::Mapper::Notification

  attribute :last_viewed_at
  attribute :moment_title
  attribute :color
  attribute :action_url
  attribute :type
  attribute :created_dt
  attribute :extras
  attribute :avatars
  attribute :icons
  attribute :new_count

  # Notifications::User
  # not necessarily always used. Depends on type & extras data.  See mapper.
  attribute :user

  class << self


    # Notification.all(opts)
    # --------------------------------------------------------------------
    # returns a YV::API::Results decorator for an array of Notification instances
    
    # options
    # * auth: required {auth: auth_hash}
    # --------------------------------------------------------------------



    # Notification.read!(opts)
    # updates last read timestamp for a user notifications
    # --------------------------------------------------------------------
    # returns nothing
    
    # options
    # * auth: required {auth: auth_hash}

    def read!(opts={})
      raise "Auth required." unless opts[:auth]
      data,errs = post("notifications/update", opts.slice(:auth))
      return YV::API::Results.new(data,errs)
    end

  end

end