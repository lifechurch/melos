module YV
  module API
    module Mapper
      class Moment < Base

        class << self

          private

          def from_find(instance,results)
            # we don't need the instance arg in this case
            map_from_kind(results)
          end

          def from_all(results)
            return results if results.empty? or results.moments.nil?
            results.moments.collect do |moment_data|
              map_from_kind(moment_data)
            end 
          end

          def from_client_side_items(results)
            return results if results.empty?
            results.collect do |client_side|
              map_from_kind(client_side)
            end
          end

          def map_from_kind(data)
            case data.kind_id
              when "note.v1"                       then to_note(::Note.new,data)
              when "bookmark.v1"                   then to_bookmark(::Bookmark.new,data)
              when "highlight.v1"                  then to_highlight(::Highlight.new,data)
              when "friendship.v1"                 then to_friendship(::Friendship.new,data)
              when "friendship.v2"                 then to_friendship(::Friendship.new,data)
              when "plan_subscription.v1"          then to_plan_subscription(::PlanSubscription.new,data)
              when "plan_completion.v1"            then to_plan_completion(::PlanCompletion.new,data)
              when "plan_segment_completion.v1"    then to_plan_segment_completion(::PlanSegmentCompletion.new,data)
              when "reading_plan_carousel.v1"      then to_reading_plan_carousel(::ReadingPlanCarousel.new,data)
              when "system.v1"                     then to_system(::SystemMoment.new,data)
              else                                      to_generic(::GenericMoment.new,data)
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

          def to_plan_subscription(instance,data)           
            YV::API::Mapper::PlanSubscription.map_to_instance(instance,data)
          end

          def to_plan_completion(instance,data)
            YV::API::Mapper::PlanCompletion.map_to_instance(instance,data)
          end

          def to_plan_segment_completion(instance,data)
            YV::API::Mapper::PlanSegmentCompletion.map_to_instance(instance,data)
          end

          def to_friendship(instance,data)
            YV::API::Mapper::Friendship.map_to_instance(instance,data)
          end

          def to_reading_plan_carousel(instance,data)
            YV::API::Mapper::ReadingPlanCarousel.map_to_instance(instance,data)
          end

          def to_generic(instance,data)
            instance.created_dt   = data.created_dt
            instance.updated_dt   = data.updated_dt
            instance.extras       = data.extras
            instance.kind_id      = data.kind_id
            instance.kind_color   = data.kind_color
            instance.body_text    = data.base.body.str if data.base.body
            instance.body_images  = map_to_body_images(data.base.images.body)
            instance.avatars      = map_to_avatars(data.base.images.avatar)
            instance.icons        = map_to_icons(data.base.images.icon)
            instance.created_dt   = data.created_dt
            instance.moment_title = t(data.base.title["l_str"],data.base.title["l_args"]) if data.base.title

            instance.comments         = map_to_comments(data.commenting.comments)
            instance.commenting       = data.commenting.enabled
            instance.comments_count   = data.commenting.total

            instance                  = map_to_like_fields(instance,data.liking)

            instance
          end

          def to_system(instance,data)
            instance.created_dt       = data.created_dt
            instance.updated_dt       = data.updated_dt
            instance.extras           = data.extras
            instance.kind_id          = data.kind_id
            # if kind_color is nil for a system moment then the moment icon triangle should not display
            instance.kind_color       = data.kind_color
            instance.moment_title     = t(data.base.title["l_str"], data.base.title["l_args"]) if data.base.title.l_str && data.base.title["l_args"]
            instance.moment_title   ||= data.base.title["str"] if data.base.title.str
            instance.body_text        = t(data.base.body["l_str"], data.base.body["l_args"]) if data.base.body
            instance.action_url       = data.base.action_url.to_s if data.base.action_url.present?

            instance.body_images      = map_to_body_images(data.base.images.body)
            instance.avatars          = map_to_avatars(data.base.images.avatar)
            instance.icons            = map_to_icons(data.base.images.icon)

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
