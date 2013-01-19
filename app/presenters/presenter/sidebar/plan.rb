module Presenter
  module Sidebar
    class Plan < Presenter::Base

      def initialize( plan_id , params = {}, controller = nil)
        super(params,controller)
        @plan_id = plan_id
      end

      def plan_id
        @plan_id
      end

      def plan
        @plan ||= ::Plan.find(params[:id])
      end

      def sidebar_partial
        "/sidebars/plans/show"
      end

    end
  end
end