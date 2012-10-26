module Presenter
  module Sidebar
    class Subscription < Presenter::Subscription

      def sidebar_partial
        "/sidebars/subscriptions/show"
      end

    end
  end
end