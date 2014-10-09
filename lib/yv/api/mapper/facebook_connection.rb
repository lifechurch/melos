module YV
  module API
    module Mapper
      class FacebookConnection < Base

        class << self

          def from_create(instance,results)

            map_to_instance(instance, results)
          end

          # example API response

          def map_to_instance(instance,results)
            # instance.created_dt = results.buildtime
            instance
          end

          def from_delete(results)
            return results
          end

        end
      end
    end
  end
end