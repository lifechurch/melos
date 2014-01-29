module YV
  module Concerns
    module Moments

      def self.included(base)
        base.attributes [:id,:user_id,:user_name,:kind_id,:kind_color,:moment_title,:created_dt,:updated_dt,:comments,:commenting,:comments_count,:likes,:liking,:likes_count,:avatars,:icons]
      end      

      def kind
        self.class.kind
      end

      def to_path
        "/#{kind.pluralize}/#{id}"
      end

      def moment_partial_path
        "moments/#{kind}"
      end

      def editable?
        true
      end

      def deletable?
        true
      end

      def liked_by?(user_id)
        return false if likes.blank?
        likes.any? {|like| like.user.id == user_id}
      end

      private

      def build_references
        return unless usfm_references and version_id
        usfms = usfm_references.split("+")
        self.references = usfms.collect {|usfm| {usfm: [usfm], version_id: version_id } }
        
        #references = [
        #  {usfm:["GEN.1.1","GEN.1.2"], version_id: 1}
        #]
      end

    end
  end
end