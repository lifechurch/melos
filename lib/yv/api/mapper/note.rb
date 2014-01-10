# {"commenting"=>{"enabled"=>true, "comments"=>nil},
#  "kind_id"=>"note.v1",
#  "base"=>
#   {"body"=>nil,
#    "images"=>
#     {"body"=>nil,
#      "avatar"=>
#       {"renditions"=>
#         [{"url"=>
#            "//d34xairzvf2fpg.cloudfront.net/users/images/7c5a1ca1111caa91093aa101783eaedd_24x24.png",
#           "width"=>24,
#           "height"=>24},
#          {"url"=>
#            "//d34xairzvf2fpg.cloudfront.net/users/images/7c5a1ca1111caa91093aa101783eaedd_48x48.png",
#           "width"=>48,
#           "height"=>48},
#          {"url"=>
#            "//d34xairzvf2fpg.cloudfront.net/users/images/7c5a1ca1111caa91093aa101783eaedd_128x128.png",
#           "width"=>128,
#           "height"=>128},
#          {"url"=>
#            "//d34xairzvf2fpg.cloudfront.net/users/images/7c5a1ca1111caa91093aa101783eaedd_512x512.png",
#           "width"=>512,
#           "height"=>512}],
#        "action_url"=>"//www.bible.com/users/BrittTheStager",
#        "style"=>"circle"},
#      "icon"=>
#       {"renditions"=>
#         [{"url"=>
#            "//commondatastorage.googleapis.com/static-youversionapi-com/moments/icons/note-white-24.png",
#           "width"=>24,
#           "height"=>24},
#          {"url"=>
#            "//commondatastorage.googleapis.com/static-youversionapi-com/moments/icons/note-white-36.png",
#           "width"=>36,
#           "height"=>36},
#          {"url"=>
#            "//commondatastorage.googleapis.com/static-youversionapi-com/moments/icons/note-white-48.png",
#           "width"=>48,
#           "height"=>48},
#          {"url"=>
#            "//commondatastorage.googleapis.com/static-youversionapi-com/moments/icons/note-white-72.png",
#           "width"=>72,
#           "height"=>72}],
#        "action_url"=>nil}},
#    "action_url"=>nil,
#    "title"=>
#     {"l_str"=>"moment.note.title",
#      "l_args"=>{"name"=>"BrittTheStager", "title"=>"ONE FINE TITLE"}}},
#  "created_dt"=>"2013-10-10T15:39:18+00:00",
#  "kind_color"=>"824f2b",
#  "id"=>5812572515205120,
#  "extras"=>
#   {"user_status"=>"private",
#    "title"=>"ONE FINE TITLE",
#    "color"=>nil,
#    "content"=>"SOME LOUSY CONTENT",
#    "system_status"=>"approved",
#    "references"=>nil,
#    "user"=>
#     {"username"=>"BrittTheStager", "id"=>7440, "name"=>"BrittTheStager"}},
#  "auth"=>{"username"=>"BrittTheStager", "password"=>"password"}}


module YV
  module API
    module Mapper
      class Note < Base

        class << self
          
          def from_all(results)
            return results if results.empty?
            collection = results.moments.collect do |moment|
              b = ::Note.new
              map_to_instance(b, moment)
            end
            collection
          end

          def from_delete(results)
            return results
          end

          def from_create(instance, results)
            from_default(instance,results)
          end

          def from_update(instance, results)
            from_default(instance,results)
          end

          def from_find(instance, results)
            from_default(instance,results)
          end

          def from_default(instance,results)
            map_to_instance(instance,results)
          end

          def map_to_instance(instance,results)
            
            # Base data
            instance.id               = results.id
            instance.kind_id          = results.kind_id
            instance.kind_color       = results.kind_color
            instance.created_dt       = results.created_dt
            instance.moment_title     = t(results.base.title["l_str"],results.base.title["l_args"])
            
            # Extras
            instance.color            = results.extras.color
            instance.title            = results.extras.title
            instance.content          = results.extras.content
            instance.user_status      = results.extras.user_status
            instance.references       = results.extras.references

            # Common moment elements
            instance                  = map_to_user_fields(instance,results.extras.user)
            instance.icons            = map_to_icons(results.base.images.icon)
            instance.avatars          = map_to_avatars(results.base.images.avatar)
            instance.comments         = map_to_comments(results.commenting.comments)
            instance.commenting       = results.commenting.enabled
            instance.comments_count   = results.commenting.total
                
            instance
          end
        end

      end
    end
  end
end