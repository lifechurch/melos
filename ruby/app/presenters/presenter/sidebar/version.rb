module Presenter
  module Sidebar
    class Version < Presenter::Base

      def initialize( v, params={}, controller=nil )
        super(params,controller)
        @version = v
      end

      def version
        @version
      end

      def related
        @related ||= ::Version.all_by_publisher[version.publisher_id].find_all{|v| v.language.tag == version.language.tag}
      end

      def sidebar_partial
        "/sidebars/versions/show"
      end

    end
  end
end