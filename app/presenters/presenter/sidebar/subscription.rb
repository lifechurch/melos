module Presenter
  module Sidebar
    class Subscription < Presenter::Subscription

      def sidebar_partial
        "/sidebars/subscriptions/display"
      end

    end
  end
end