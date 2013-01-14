module Presenter
  class Subscription < Presenter::Base

    include Presenter::ReaderInterface

    delegate :name, to: :subscription, prefix: true

    def initialize( sub, params = {}, controller = nil )
      super(params,controller)
      @subscription = sub
      @subscription.version_id = @params[:version] || @subscription.version_id || @controller.send(:current_version)
      @params[:day] ||= @subscription.current_day
    end

    def subscription
      @subscription
    end

    def day
      @day ||= @params[:day].to_i
    end

    def reading
      @reading ||= @subscription.reading(day)
    end

    def devotional
      reading.devotional
    end

    def content_page
      @content_page = nil                              # nil for any page not in subscriptions controller
      if controller.controller_name == "subscriptions"
        if controller.action_name == "devotional"      # return -1 for devotional content pages
          @content_page = -1
        else                                           # otherwise 0..N index
          @content_page ||= Range.new(0, reading.references.count - 1).include?(@params[:content].to_i) ? @params[:content].to_i : 0 #coerce content page to 1st page if outside range
        end
      end
      return @content_page
    end

    # implementation for Presenter::ReaderInterface method
    def reference
      unless reading.references.empty?
        ref_with_verses = reading.references[content_page].ref
        ::Reference.new(ref_with_verses, verses: nil)     # return a reference for the whole chapter
      end
    end

    # implementation for Presenter::ReaderInterface method
    def alt_reference
      @alt_reference ||= ::Reference.new(reference, version: alt_version)
    end

    # implementation for Presenter::ReaderInterface method
    def version
      @version ||= Version.find subscription.version_id
    end

    # implementation for Presenter::ReaderInterface method
    def alt_version
      @alt_version ||= Version.find(controller.send(:alt_version,reference))
    end

    # implementation for Presenter::ReaderInterface method
    def verses
      unless reading.references.empty?
        ref_with_verses = reading.references[content_page].ref
        ref_with_verses.verses
      end
    end

    def focus?
      true
    end

    def note
      Note.new(version_id: subscription.version_id)
    end


    # implementation for Presenter::ReaderInterface method
    def modal_verse
      nil
    end



  end
end