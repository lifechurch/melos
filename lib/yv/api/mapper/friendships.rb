module YV
  module API
    module Mapper
      class Friendships < Base

        class << self

          def map_incoming(results)
            friendships = ::Friendships.new
            users = results.users.collect do |user_data|
              map_to_user(User.new,user_data)
            end
            friendships.incoming = users
            friendships
          end

          def map_decline(results)
            from_default(results)
          end

          def map_accept(results)
            from_default(results)
          end

          def map_offer(results)
            from_default(results)
          end

          def from_all(results)
            from_default(results)
          end

          def from_default(results)
            friendships = ::Friendships.new
            friendships.outgoing_ids = results.outgoing
            friendships.incoming_ids = results.incoming
            friendships
          end

        end
        
      end
    end
  end
end