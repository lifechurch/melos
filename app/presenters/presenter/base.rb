module Presenter
  class Base

    include ApplicationHelper # Custom helpers

    def initialize( params = {} , controller = nil )
      @params = params
      @controller = controller
    end

    def controller
      @controller
    end

    def params
      @params
    end

  end
end