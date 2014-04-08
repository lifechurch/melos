module YV
  module API
    module Mapper
      class SubscriptionsPartner < Base

        class << self

          private

          def from_all(results)
            return results
            return results if results.blank? # return if results are empty array
            results.users.collect do |user_data|
              map_to_instance(::Subscriptions::Partner.new,user_data)
            end
          end

          def map_to_instance(instance, data)
            instance.user_id = data.user_id
            instance.user_name = data.username
            instance.user_avatar_url = data.user_avatar_url
            instance.created_dt = data.created_dt
            instance
          end

        end
      end
    end
  end
end