module YV
  module API
    module Mapper
      class Moment < Base

        class << self

          private

          def from_all(results)
            return results if results.empty?
            results.moments.collect do |moment_data|
              map_from_kind(moment_data)
            end 
          end

          def map_from_kind(data)

            case data.kind_id
              when "note.v1"        then to_note(::Note.new,data)
              when "bookmark.v1"    then to_bookmark(::Bookmark.new,data)
              when "highlight.v1"   then to_highlight(::Highlight.new,data)
              when "friendship.v1"  then to_friendship(::Friendship.new,data)
              #else map_instance_to_generic()
            end
          end

          def to_note(instance,data)
            YV::API::Mapper::Note.map_to_instance(instance,data)
          end

          def to_bookmark(instance,data)
            YV::API::Mapper::Bookmark.map_to_instance(instance,data)
          end

          def to_highlight(instance,data)
            YV::API::Mapper::Highlight.map_to_instance(instance,data)
          end

          def to_friendship(instance,data)
            extras  = data.extras
            user    = extras.user
            friend  = extras.friend

            instance.user = SimpleUser.new(
              name: user.name,
              user_name: user.username,
              id: user.id,
              avatars: map_to_avatars(user.avatar)
            )

            instance.friend = SimpleUser.new(
              name: friend.name,
              user_name: friend.username,
              id: friend.id,
              avatars: map_to_avatars(friend.avatar)
            )

            instance.kind_id          = data.kind_id
            instance.kind_color       = data.kind_color
            instance.created_dt       = data.created_dt
            instance.updated_dt       = data.updated_dt
            instance.moment_title     = t(data.base.title["l_str"],data.base.title["l_args"])

            # Common moment elements
            instance.icons            = map_to_icons(data.base.images.icon)
            instance.avatars          = map_to_avatars(data.base.images.avatar)
            instance.comments         = map_to_comments(data.commenting.comments)
            instance.commenting       = data.commenting.enabled
            instance.comments_count   = data.commenting.total

            instance
          end



        end
      end
    end
  end
end