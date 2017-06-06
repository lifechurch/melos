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

    def versions_for_current_lang
      @versions_for_current_lang = Version.all_by_language(only: controller.send(:site).versions)[version.language.tag] || []
    end

    def recent_versions
      @recent_versions = controller.send(:recent_versions) || []
    end

  end
end