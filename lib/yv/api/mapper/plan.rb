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
            unless defined?(results.errors) || results == []
              results.reading_plans.collect do |plan_data|
                map_to_instance(::Plan.new,plan_data)
              end
            else
              []
            end
            # todo catch search.language_tag.invalid error
          end

          def map_to_instance(instance,data)
            instance.id               = data.id
            instance.name             = data.name[I18n.locale.to_s]
            instance.total_days       = data.total_days
            instance.copyright        = data.copyright.text[I18n.locale.to_s]
            instance.about            = data.about.text[I18n.locale.to_s]
            instance.version_id       = data.version_id
            instance.created_dt       = data.created_dt
            instance.slug             = data.slug
            instance.formatted_length = data.formatted_length[I18n.locale.to_s]
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