module YV
  module API
    module Mapper
      class Device < Base

        class << self


        private

          def from_find(instance,results)
            map_to_instance(instance,results)
          end

          def from_all(results)
            from_collection(results)
          end

          def from_collection(results)
            collection = results.devices.collect do |device|
              d = ::Device.new
              map_to_instance(d,device)
            end
          end

          def map_to_instance(instance,results)
            instance.id         = results.id
            instance.vendor     = results.vendor
            instance.model      = results.model
            instance.os         = results.os
            instance.device_id  = results.device_id
            instance.carrier    = results.carrier
            instance.notes      = results.notes
            instance.created_dt = results.created_dt
            instance
          end


        end
        
      end
    end
  end
end