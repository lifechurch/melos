# {"commenting"=>{"enabled"=>true, "comments"=>nil},
#  "kind_id"=>"bookmark.v1",
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
#            "//commondatastorage.googleapis.com/static-youversionapi-com/moments/icons/bookmark-white-24.png",
#           "width"=>24,
#           "height"=>24},
#          {"url"=>
#            "//commondatastorage.googleapis.com/static-youversionapi-com/moments/icons/bookmark-white-48.png",
#           "width"=>48,
#           "height"=>48}],
#        "action_url"=>nil}},
#    "action_url"=>nil,
#    "title"=>
#     {"l_str"=>"moment.bookmark.title",
#      "l_args"=>{"reference_human"=>"Genesis 1:1", "name"=>"Britt Miles"}}},
#  "created_dt"=>"2013-10-03T14:52:30+00:00",
#  "kind_color"=>"a9321e",
#  "id"=>5110435556622336,
#  "extras"=>
#   {"color"=>"000000",
#    "labels"=>nil,
#    "references"=>[{"human"=>nil, "version_id"=>1, "usfm"=>"GEN.1.1"}],
#    "user"=>{"username"=>"BrittTheStager", "id"=>7440, "name"=>"Britt Miles"},
#    "title"=>"3.1 booky."}}


module YV
  module Concerns
    module Identifiable

      def self.included(base)
        base.attribute :id
        base.attribute :kind_id
        base.attribute :kind_color
        base.attribute :created_dt
      end

      def process_identifiable(data)
        self.id         = data.id if data.id
        self.kind_id    = data.kind_id if data.kind_id
        self.kind_color = data.kind_color if data.kind_color
        self.created_dt = data.created_dt if data.created_dt
      end

    end
  end
end