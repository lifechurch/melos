module YV
  module API
    module Mapper
      class Comment < Base

        class << self

          def from_create(instance,results)
            # API returns a list of all comments, not just the one being created
            # lets just map to a single instance of comment for the one being
            # created (last in the array of results)
            map_to_instance(instance, results.comments.last)
          end

          # example API response

          # {"next_page"=>nil,
          #  "comments"=>
          #   [{"content"=>"I'm commenting on my bookmark!",
          #     "user"=>
          #      {"username"=>"BrittTheStager",
          #       "id"=>7440,
          #       "avatar"=>
          #        {"renditions"=>
          #          [{"url"=>
          #             "//d34xairzvf2fpg.cloudfront.net/users/images/7c5a1ca1111caa91093aa101783eaedd_24x24.png",
          #            "width"=>24,
          #            "height"=>24},
          #           {"url"=>
          #             "//d34xairzvf2fpg.cloudfront.net/users/images/7c5a1ca1111caa91093aa101783eaedd_48x48.png",
          #            "width"=>48,
          #            "height"=>48},
          #           {"url"=>
          #             "//d34xairzvf2fpg.cloudfront.net/users/images/7c5a1ca1111caa91093aa101783eaedd_128x128.png",
          #            "width"=>128,
          #            "height"=>128},
          #           {"url"=>
          #             "//d34xairzvf2fpg.cloudfront.net/users/images/7c5a1ca1111caa91093aa101783eaedd_512x512.png",
          #            "width"=>512,
          #            "height"=>512}],
          #         "action_url"=>"//www.bible.com/users/BrittTheStager",
          #         "style"=>"circle"},
          #       "name"=>"Britt Miles"},
          #     "id"=>1381163680698150}]}

          def from_all(results)
            from_collection(results)
          end

          def from_collection(results)
            collection = results.comments.collect do |comment|
              map_to_instance(::Comment.new, comment)
            end
          end

          def map_to_instance(instance,results)
            instance.id         = results.id.to_s
            instance.content    = results.content
            instance.user       = map_to_user(::User.new,results.user)
            instance.created_dt = results.created_dt
            instance.updated_dt = results.updated_dt
            instance
          end

          def from_delete(results)
            return results
          end

        end
      end
    end
  end
end