module YV
  module API
    module Mapper
      class Friend < Base

        class << self

          def from_all(results)
            return results if results.empty?
            results.users.collect do |user_data|
              map_to_user(User.new,user_data)
            end
          end

        end

      end
    end
  end
end