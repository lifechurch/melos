module YV
  module API
    module Mapper
      class Subscription < Base

        class << self

            def map_subscribe(results)
              map_to_instance(::Subscription.new,results)
            end

            def from_find(instance,results)
              map_to_instance(instance,results)
            end

            def from_update(instance,results)
              map_to_instance(instance,results)
            end

            def from_all(results)
              return results if results.blank?
              from_collection(results)
            end

            def from_collection(results)
              return results if results.blank?
              results.reading_plans.collect do |plan_data|
                map_to_instance(::Subscription.new,plan_data)
              end
            end

            def map_to_instance(instance,data)
              instance.id               = data.id
              instance.name             = YV::Resource.i18nize(data.name)
              instance.total_days       = data.total_days
              instance.copyright        = YV::Resource.i18nize(data.copyright.text) #TODO: html data
              instance.about            = YV::Resource.i18nize(data.about.text) #TODO: html data
              instance.version_id       = data.version_id
              instance.created_dt       = data.created_dt
              instance.slug             = data.slug
              instance.formatted_length = YV::Resource.i18nize(data.formatted_length)
              instance.default_start_dt = data.default_start_dt
              instance.type             = data.type
              instance.publisher_url    = data.publisher_url
              instance.short_url        = data.short_url
              instance.user_id          = data.user_id
              instance.private          = data.private
              instance.completion_percentage = data.completion_percentage
              instance.token            = data.token
              instance.start_day        = data.start_day
              instance.user_name        = data.username
              instance.start_dt         = data.start_dt
              instance.end_dt           = data.end_dt
              instance.subscribed_dt    = data.subscribed_dt
              instance.email_delivery   = data.email_delivery
              instance.email_delivery_version_id = data.email_delivery_version_id
              instance.user_avatar_url  = data.user_avatar_url
              return instance
            end

        end
      end
    end
  end
end