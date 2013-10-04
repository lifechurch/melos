# {"commenting"=>{"enabled"=>true, "comments"=>nil},
#  "kind_id"=>"bookmark.v1",
#  "base"=>
#   {"body"=>nil,
#    "images"=>
#     {"body"=>nil,
#      "avatar"=>
# ....


module YV
  module Concerns
    module Commentable

      def self.included(base)
        base.attribute :comments
      end

      def process_comments(data)
        if @commenting = (data.commenting && data.commenting.enabled == true) ? true : false
           @comments = data.commenting.comments
        end
      end

      def commenting?
        @commenting
      end

      def comments
        @comments
      end

    end
  end
end