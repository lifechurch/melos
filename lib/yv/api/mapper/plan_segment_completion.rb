module YV
  module API
    module Mapper
      class PlanSegmentCompletion < Base

        class << self

          def from_all(plan_datas)
            return plan_data if plan_data.empty?
            plan_datas.collect do |plan_data|
              map_to_instance(PlanSegmentCompletion.new,plan_data)
            end
          end

          def map_to_instance(instance,plan_data)
            instance.id               = plan_data.id.to_s
            instance.kind_id          = plan_data.kind_id
            instance.kind_color       = plan_data.kind_color
            instance.moment_title     = t(plan_data.base.title["l_str"],plan_data.base.title["l_args"])
            instance.action_url       = plan_data.base.action_url
            # Common moment elements
            instance                  = map_to_user_fields(instance,plan_data.extras.user)
            instance.icons            = map_to_icons(plan_data.base.images.icon)
            instance.avatars          = map_to_avatars(plan_data.base.images.avatar)
            
            instance.comments         = map_to_comments(plan_data.commenting.comments)
            instance.commenting       = plan_data.commenting.enabled
            instance.comments_count   = plan_data.commenting.total

            instance                  = map_to_like_fields(instance,plan_data.liking)
            instance.created_dt       = plan_data.created_dt
            instance
            # raise 'the roof'
          end

        end

      end
    end
  end
end