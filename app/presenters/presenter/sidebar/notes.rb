module Presenter
  module Sidebar
    class Notes < Presenter::Base

      def sidebar_partial
        "/sidebars/notes/index"
      end

    end
  end
end