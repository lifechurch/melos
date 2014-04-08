module YV
  module API
    module Mapper
      class People < Base

        class << self


        # example API response
        # {"next_page"=>nil,
        #  "people"=>
        #   [{"username"=>"bdmtest14",
        #     "id"=>6752,
        #     "avatar"=>
        #      {"renditions"=>
        #        [{"url"=>
        #           "//d34xairzvf2fpg.cloudfront.net/users/images/54fb49451ee6a5924d58703f96c80b1d_24x24.png",
        #          "width"=>24,
        #          "height"=>24},
        #         {"url"=>
        #           "//d34xairzvf2fpg.cloudfront.net/users/images/54fb49451ee6a5924d58703f96c80b1d_48x48.png",
        #          "width"=>48,
        #          "height"=>48},
        #         {"url"=>
        #           "//d34xairzvf2fpg.cloudfront.net/users/images/54fb49451ee6a5924d58703f96c80b1d_128x128.png",
        #          "width"=>128,
        #          "height"=>128},
        #         {"url"=>
        #           "//d34xairzvf2fpg.cloudfront.net/users/images/54fb49451ee6a5924d58703f96c80b1d_512x512.png",
        #          "width"=>512,
        #          "height"=>512}]},
        #     "name"=>"bdmtest14"},
        #     { another_user }

          def map_suggestions(results)
            from_collection(results)
          end

          def from_all(results)
            from_collection(results)
          end

          def from_collection(results)
            collection = results.people.collect do |person|
              p = ::People.new
              map_to_instance(p, person)
            end
          end

          def map_to_instance(instance,results)
            instance.name = results.name
            instance.user_name = results.username
            instance.user_id   = results.id
            instance
          end

        end

      end
    end
  end
end