module Presenter
  class Subscription < Presenter::Base

    include Presenter::ReaderInterface

    delegate :name,         to: :subscription, prefix: true
    delegate :devotional,   to: :reading

    def initialize( subscription, params = {}, controller = nil )
      super(params,controller)
      @subscription = subscription

      if (initial_load?)
        @subscription.version_id = params[:version] || @subscription.version_id || controller.send(:current_version)
      else
        @subscription.version_id = controller.send(:current_version) || params[:version] || @subscription.version_id
      end
    end

    def initial_load?
      @params[:initial] || @controller.send(:external_request?)
    end

    def subscription_id
      subscription.id.to_i
    end

    def subscription
      @subscription
    end

    def plan
      @subscription
    end

    def day
      @params[:day] ||= subscription.current_day
      @day          ||= @params[:day].to_i
    end

    def reading
      @reading ||= subscription.reading(day)
    end

    def content_page
      c_name    = controller.controller_name
      c_action  = controller.action_name

      # For any page other than subscriptions#show or #shelf we want to return nil as the content_page
      # as to not default to 0 (code below) and thus inadvertently highlighting first reading as active
      return nil unless (c_name == "subscriptions" && c_action == "ref") ||
                        (c_name == "plans" && c_action == "sample")

      @content_page ||= Range.new(0, reading.api_references.count - 1).include?(@params[:content].to_i) ? @params[:content].to_i : 0 #coerce content page to 1st page if outside range
    end

    def is_chapter?
      verses.blank?
    end

    # implementation for Presenter::ReaderInterface method
    # subscription.reference will always be a chapter ref
    # this is so we can display the whole chapter in the reader
    # and then focus only the verses we need to later.

    # reading API response
    # {"plan_id"=>601,
    #  ...,
    #  "references"=>[{"reference"=>"JHN.15.9", "completed"=>false}],

    def reference_usfm
      reading.api_references[content_page || 0].reference #content page can be nil
    end

    def reference
      return @reference if @reference.present?

      @reference = if reading.api_references.present?
        ref = ::Reference.new(reference_usfm,{version: subscription.version_id})
        begin
          testRef = ref.content
        rescue NotAChapterError
          ref = ::Reference.new(reference_usfm,{version: 110})
        end
        ref
      end
    end

    def reference_string
      YV::ReferenceString.new(reference_usfm,overrides:{version:subscription.version_id})
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
      reference_string.verses
    end

    # implementation for Presenter::ReaderInterface method
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

    def on_track_status
      today = Date.today()

      missed_days = 0
      ahead_days = 0

      subscription.day_statuses.each do |cur_status|
        cur_date = Date.parse(cur_status.date)
        is_active = cur_status.day.equal? day

        missed_days = missed_days + 1 if !cur_status.completed && cur_date < today
        ahead_days = ahead_days + 1 if cur_status.completed && cur_date > today
      end

      return "behind #{missed_days}" if missed_days > 0
      return "ahead #{ahead_days}" if ahead_days > 0
      return "on track"
    end

  end
end