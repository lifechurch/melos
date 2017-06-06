module YV
  module API
    module Mapper
      class NotificationSettings < Base

        class << self

          private

          def from_find(instance, results)
            instance.notification_settings = results.notification_settings
            instance.language_tag   = results.language_tag
            instance.user_id        = results.user_id
            instance.token          = results.token
            instance.auth           = results.auth
            instance
          end

        end
      end
    end
  end
end