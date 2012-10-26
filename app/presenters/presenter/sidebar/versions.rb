module Presenter
  module Sidebar
    class Versions < Presenter::Base

      def initialize( vs, params={}, controller=nil )
        super(params,controller)
        @versions = vs
      end

      def versions
        @versions
      end

      def sidebar_partial
        "/sidebars/versions/index"
      end

    end
  end
end