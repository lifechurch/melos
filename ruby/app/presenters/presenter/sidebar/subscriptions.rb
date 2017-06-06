module Presenter
  module Sidebar
    class Subscriptions < Presenter::Base

      def initialize( subs, params={}, controller=nil )
        super(params,controller)
        @subscriptions = subs
      end

      def subscriptions
        @subscriptions
      end

      def sidebar_partial
        "/sidebars/subscriptions/index"
      end

    end
  end
end