module YV
  module API
    module Mapper
      class UserSearch < Base

        class << self

          private

          def from_search(results)
            return results if results.blank? or results.users.blank?
            users = results.users.collect do |user_data|
              u = ::User.new
              u.id       = user_data.id
              u.username = user_data.username
              u.name     = user_data.name
              u.avatars  = map_to_avatars(user_data.avatar)
              u
            end
            return YV::API::Results.new(users)
            
          end
        end
      end
    end
  end
end