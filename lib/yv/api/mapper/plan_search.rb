# This mapper extends from Plan Mapper
# For a search, makes use of from_all mapping method
# which gives an array of Plan instances for a given search

module YV
  module API
    module Mapper
      class PlanSearch < Plan

        class << self
          
          private
          
          def from_search(results)
            from_all(results)
          end

        end

      end
    end
  end
end