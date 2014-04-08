module YV
  module API
    module Mapper
      class PlansReading < Base

        class << self

          private

          def from_find(instance,results)
            map_to_instance(instance,results)
          end

          def map_to_instance(instance,data)
            instance.plan_id          = data.id 
            instance.subscribed_dt    = data.subscribed_dt
            instance.plan_total_days  = data.total_days
            instance.day              = data.day
            instance.next_day         = data.next
            instance.prev_day         = data.prev
            instance.api_references   = data.references
            instance.additional_content_text = data.additional_content.text["default"] # TODO: localize
            instance.additional_content_html = data.additional_content.html["default"] # TODO: localize
            instance.short_url        = data.short_url
            instance.auth             = data.auth
            return instance
          end
        end
      end
    end
  end
end