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
            unless results == []
              puts results
              if results.errors? or results.reading_plans.nil?
                return []
              else
                results.reading_plans.collect do |plan_data|
                  map_to_instance(::Plan.new,plan_data)
                end
              end
            # todo properly catch errors search.language_tag.invalid error
            end
          end

          def locale
            # This is a hack until the API team decides what's going on with locales
            case I18n.locale.to_s
            when 'pt-BR' || 'pt-PT'
              'pt'
            when 'en-GB'
              'en'
            when 'es-ES'
              'es'
            when 'zh-CN'
              'zh_CN'
            when 'zh-TW'
              'zh_TW'
            else
              I18n.locale.to_s
            end
          end

          def map_to_instance(instance,data)
            instance.id               = data.id
            instance.name             = YV::Resource.i18nize(data.name)
            instance.total_days       = data.total_days
            instance.copyright        = YV::Resource.i18nize(data.copyright)
            instance.about            = YV::Resource.i18nize(data.about)
            instance.version_id       = data.version_id
            instance.created_dt       = data.created_dt
            instance.slug             = data.slug
            instance.formatted_length = YV::Resource.i18nize(data.formatted_length)
            instance.default_start_dt = data.default_start_dt
            instance.type             = data.type

            instance.publisher_url    = data.publisher_url
            instance.short_url        = data.short_url
            instance.images           = data.images
            instance.language_tag     = data.language_tag
            return instance
          end
        end
      end
    end
  end
end
