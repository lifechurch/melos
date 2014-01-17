module YV
  module API
    module Mapper
      class Friendships < Base

        class << self

          def map_incoming(results)
            return results unless results.valid? # return original result object if it contains errors

            friendships = ::Friendships.new
            friendships.incoming = if results.users
              results.users.collect do |user_data|
                map_to_user(::User.new,user_data)
              end
            else
              []
            end

            YV::API::Results.new(friendships)
          end

          def from_default(results)
            return results unless results.valid? # return original result object if it contains errors
            friendships = ::Friendships.new
            friendships.outgoing_ids = results.outgoing
            friendships.incoming_ids = results.incoming
            
            YV::API::Results.new(friendships)
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

        end
        
      end
    end
  end
end