module YV
  module API
    module Mapper
      class PlanCompletion < Base

        class << self

          def from_all(plan_datas)
            return plan_datas if plan_datas.empty?
            plan_datas.collect do |plan_data|
              map_to_instance(PlanCompletion.new,plan_data)
            end
          end

          def map_to_instance(instance,plan_data)
            instance.id               = plan_data.id.to_s
            instance.kind_id          = plan_data.kind_id
            instance.kind_color       = plan_data.kind_color
            instance.moment_title     = t(plan_data.base.title["l_str"],plan_data.base.title["l_args"])
            instance.body_text        = plan_data.base.body.str
            instance.action_url       = "/reading-plans/#{plan_data.extras.plan_id}-#{plan_data.extras.slug}" if (plan_data.extras.plan_id.present? and plan_data.extras.slug.present?)
            instance.action_url       ||= "/reading-plans/#{plan_data.extras.plan_id}" if plan_data.extras.plan_id.present?
            instance.action_url       ||= ""
            instance.plan_id          = plan_data.extras.plan_id

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
          end

        end

      end
    end
  end
end