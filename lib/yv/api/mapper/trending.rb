module YV
  module API
    module Mapper
      class Trending < Base

        class << self

          def from_all(results)
            sp = results
            sp = sp.take(10) if sp.present?
            YV::API::Results.new(sp)
          end

        end

      end
    end
  end
end