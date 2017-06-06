module Presenter
  module Sidebar
    class Reference < Presenter::Reference

      def sidebar_partial
        "/sidebars/references/show"
      end

    end
  end
end