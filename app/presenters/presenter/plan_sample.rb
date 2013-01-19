module Presenter
  class PlanSample < Presenter::Base

    include Presenter::ReaderInterface

    attr_accessor :alt_reference, :version, :alt_version

    def initialize( planid, params = {}, controller = nil)
      super(params,controller)
      @planid = planid
    end

    def plan_id
      @planid
    end

    def plan
      @plan ||= Plan.find(plan_id)
    end

    def reading
      @reading ||= plan.reading(1)
    end

    def raw_reference
      @raw_ref ||= reading.references[0].ref
    end

    def reference
      @reference ||= raw_reference.to_chapter
    end

    def verses
      @verses ||= raw_reference.verses
    end

    def version
      vid = params[:version] || plan.version_id || controller.send(:current_version)
      @version ||= Version.find(vid)
    end

    def alt_version
      @alt_version ||= Version.find(controller.send(:alt_version,reference))
    end

    def alt_reference
      @alt_reference ||= ::Reference.new(reference, version: alt_version)
    end

    def is_chapter?
      raw_reference.is_chapter?
    end

    def focus?
      true
    end

    def modal_verse
      nil
    end

  end
end