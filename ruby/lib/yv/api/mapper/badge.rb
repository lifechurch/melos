module YV
  module API
    module Mapper
      class Badge < Base

        class << self

          private

          def from_all(results)
            badges = unless results.empty?
              results.badges.collect do |badge|
                b = ::Badge.new
                map_to_instance(b,badge)
              end
            else
              []
            end

            YV::API::Results.new(badges)
          end

          def from_find(instance,results)
            map_to_instance(instance,results)
          end


          def map_to_instance(instance,results)
            instance.id = results.id
            instance.slug = results.slug
            instance.name = YV::Resource.i18nize(results.name).gsub(/\\u([0-9a-z]{4})/) {|s| [$1.to_i(16)].pack("U")}
            instance.description = YV::Resource.i18nize(results.description).gsub(/\\u([0-9a-z]{4})/) {|s| [$1.to_i(16)].pack("U")}
            instance.image_url = results.image_url
            instance.type = results.type
            instance.user_id = results.user_id
            instance.username = results.username
            instance.earned_dt = results.earned_dt
            YV::API::Results.new(instance)
          end

        end
        
      end
    end
  end
end