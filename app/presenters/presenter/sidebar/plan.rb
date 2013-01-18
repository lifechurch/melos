module Presenter
  module Sidebar
    class Plan < Presenter::Base

      def initialize( plan , params = {}, controller = nil)
        super(params,controller)
        @plan = plan
      end

      def plan
        @plan
      end

      def sidebar_partial
        "/sidebars/plans/show"
      end

    end
  end
end