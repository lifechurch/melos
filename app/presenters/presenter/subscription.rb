module Presenter
  class Subscription < Presenter::Base

    include Presenter::ReaderInterface

    delegate :name, to: :subscription, prefix: true

    def initialize( subscription, params = {}, controller = nil )
      super(params,controller)
      @subscription = subscription
      @subscription.version_id = params[:version] || @subscription.version_id || controller.send(:current_version)
      @sid = subscription.id.to_i
    end

    def subscription_id
      @sid
    end

    def subscription
      @subscription
    end

    def day
      @params[:day] ||= subscription.current_day
      @day          ||= @params[:day].to_i
    end

    def reading
      @reading ||= subscription.reading(day)
    end

    def devotional
      reading.devotional
    end

    def content_page
      c_name    = controller.controller_name
      c_action  = controller.action_name

      # For any page other than subscriptions#show or #shelf we want to return nil as the content_page
      # as to not default to 0 (code below) and thus inadvertently highlighting first reading as active
      return nil unless (c_name == "subscriptions" && (c_action == "show" || c_action == "shelf")) ||
                        (c_name == "plans" && c_action == "sample")

      @content_page ||= Range.new(0, reading.references.count - 1).include?(@params[:content].to_i) ? @params[:content].to_i : 0 #coerce content page to 1st page if outside range
    end

    def is_chapter?
      reading.references[content_page].ref.is_chapter?
    end

    # implementation for Presenter::ReaderInterface method
    # subscription.reference will always be a chapter ref
    # this is so we can display the whole chapter in the reader
    # and then focus only the verses we need to later.
    def reference
      unless reading.references.empty?
        ref = reading.references[content_page || 0].ref #content page can be nil
        ref.to_chapter
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