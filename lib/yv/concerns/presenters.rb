module YV
  module Concerns
    module Presenters

      def self.included(base)
        base.helper_method :sidebar_presenter, :presenter
      end

      protected
      
      # Before filter
      def set_default_sidebar
        sidebar_presenter = Presenter::Sidebar::Default.new
      end

      # setter
      def presenter=(pres)
        @presenter = pres
      end

      # getter
      def presenter
        @presenter
      end

      # setter for controllers
      def sidebar_presenter=( pres )
        @sb_presenter = pres
      end

      # getter for controllers and views as a view helper
      def sidebar_presenter( opts = {} )
        @sb_presenter
      end

    end
  end
end