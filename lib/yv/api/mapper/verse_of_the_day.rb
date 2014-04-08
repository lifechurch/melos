module YV
  module API
    module Mapper
      class VerseOfTheDay < Base

        class << self

          def from_all(results)
            return results if results.empty?
            results.collect do |votd_data|
              map_to_instance(VOD.new,votd_data)
            end
          end

          def map_to_instance(instance,votd_data)
            # split on + separated refs to get a more standard array of USFM ref values
            instance.references = votd_data.references.first.split("+")
            instance.day = votd_data.day
            instance
          end

        end

      end
    end
  end
end