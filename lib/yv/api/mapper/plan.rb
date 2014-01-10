module YV
  module API
    module Mapper
      class Plan < Base

        class << self

          private

          def from_find(instance,results)
            map_to_instance(instance,results)
          end

          def from_all(results)
            results.reading_plans.collect do |plan_data|
              map_to_instance(::Plan.new,plan_data)
            end
          end

          def map_to_instance(instance,data)
            instance.id               = data.id
            instance.name             = data.name["default"] #TODO localize
            instance.total_days       = data.total_days
            instance.copyright        = data.copyright.text["default"] #TODO: localize + html data
            instance.about            = data.about.text["default"] #TODO: localize + html data
            instance.version_id       = data.version_id
            instance.created_dt       = data.created_dt
            instance.slug             = data.slug
            instance.formatted_length = data.formatted_length["default"] #TODO: localize
            instance.default_start_dt = data.default_start_dt
            instance.type             = data.type
            instance.publisher_url    = data.publisher_url
            instance.short_url        = data.short_url
            return instance
          end
        end
        
      end
    end
  end
end