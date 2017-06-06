module YV
  module API
    module Mapper
      class ReadingPlanCarousel < Base

        class << self

          def from_all(results)
            from_collection(results)
          end

          def from_collection(results)
            # If the data is a blank/empty array, return it
            return results if results.blank?
            collection = results.collect do |moment|
              map_to_instance(::ReadingPlanCarousel.new, moment)
            end
          end

          def map_to_instance(instance,data)
            instance.created_dt       = data.behaviors.created_dt
            instance.expanded_dt      = data.behaviors.expanded_dt.map{|d| DateTime.parse(d) }
            instance.category         = data.behaviors.category
            # instance.updated_dt       = data.updated_dt
            # instance.extras           = data.extras
            instance.kind_id          = data.kind_id
            # # if kind_color is nil for a system moment then the moment icon triangle should not display
            # instance.kind_color       = data.kind_color

            instance.moment_title     = t(data.base.title["l_str"], data.base.title["l_args"]) if data.base.title.l_str
            instance.moment_title   ||= data.base.title["str"] if data.base.title.str

            # instance.body_text        = t(data.base.body["l_str"], data.base.body["l_args"]) if data.base.body
            # instance.action_url       = data.base.action_url.to_s if data.base.action_url.present?

            instance.body_images      = map_to_body_images(data.base.images.body)
            instance.avatars          = map_to_avatars(data.base.images.avatar)
            # instance.icons            = map_to_icons(data.base.images.icon)

            # instance.comments         = map_to_comments(data.commenting.comments)
            instance.commenting       = data.commenting.enabled
            # instance.comments_count   = data.commenting.total

            # instance                  = map_to_like_fields(instance,data.liking)
            instance
          end

        end
      end
    end
  end
end