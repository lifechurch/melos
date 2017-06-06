module YV
  module API
    module Mapper
      class Friendship < Base

        class << self

          def from_all(friendships)
            return friendships if friendships.empty?
            friendships.collect do |friendship|
              map_to_instance(Friendship.new,friendship)
            end
          end

          def to_simple_user(user)
           SimpleUser.new(
              name:       user.name,
              user_name:  user.username,
              id:         user.id,
              avatars:    map_to_avatars(user.avatar)
            )
          end

          def map_to_instance(instance,data)

            instance.user             = to_simple_user(data.extras.user)
            instance.friend           = to_simple_user(data.extras.friend)
            
            instance.id               = data.id.to_s
            instance.kind_id          = data.kind_id
            instance.kind_color       = data.kind_color
            instance.created_dt       = data.created_dt
            instance.updated_dt       = data.updated_dt
            instance.moment_title     = t(data.base.title["l_str"],data.base.title["l_args"])

            instance.icons            = map_to_icons(data.base.images.icon)
            instance.avatars          = map_to_avatars(data.base.images.avatar)

            # Common moment elements
            instance.comments         = map_to_comments(data.commenting.comments)
            instance.commenting       = data.commenting.enabled
            instance.comments_count   = data.commenting.total
            instance                  = map_to_like_fields(instance,data.liking)

            instance
          end

        end

      end
    end
  end
end