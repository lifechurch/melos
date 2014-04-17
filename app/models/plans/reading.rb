module Plans
  class Reading < YV::Resource

    api_response_mapper YV::API::Mapper::PlansReading

    attribute :auth
    attribute :day
    attribute :next_day
    attribute :prev_day
    attribute :api_references
    attribute :additional_content_text
    attribute :additional_content_html
    attribute :plan_id
    attribute :plan_total_days
    attribute :short_url
    attribute :subscribed_dt

    class << self

      def resource_path
        "reading-plans/references"
      end

      def find(opts={})
        opts[:day] ||= 1
        opts[:id]  ||= id
        opts[:cache_for] ||= YV::Caching.a_very_long_time
        super(nil,opts)
      end

    end

    # Raw references from API
    # "api_references"=>[{"reference"=>"JHN.15.9", "completed"=>false}]
    def references(opts={})
      raise "Requires :version_id in opts" unless opts[:version_id]
      if attributes.api_references
        refs = attributes.api_references.collect do |r|
          ref = Plans::Reference.new
          ref.reference = ::Reference.new(r.reference, version: opts[:version_id])
          ref.completed = r.completed
          ref
        end
      end
    end


    def devotional
      @devotial ||= additional_content_html || additional_content_text
    end

  end
end

#   def process_references_response(response)
#       @reading_day = response.day.to_i
#       @reading_version = version_id     #version_id can be nil
# 
#       #TODO: it probably makes sense for a reading to be it's own class within Plan
#       #      so this should all be done resourcefully in a after_create class, etc
#       @reading = Hashie::Mash.new()
# 
#       #get localized html || text via i18nize method and massage a bit
#       if @reading.devotional = YV::Resource.i18nize(response.additional_content)
#         # if ascii spacing is in the html, just remove it, instead of adding p's
#         # to avoid adding unecessarry spacing
#         spacer = YV::Resource.html_present?(response.additional_content) ? '' : '</p><p>'
#         @reading.devotional = @reading.devotional.gsub(/(\r\n\r\n|\n\n|\r\n|\n|\u009D)/, spacer)
#         @reading.devotional = "<p>" << @reading.devotional << "</p>" if spacer.present?
#       end
# 
#       @reading.references = response.references.map do |data|
#         Hashie::Mash.new(ref: Reference.new(data.reference, version: @reading_version || Version.default), completed?: (data.completed || data.completed == "true"))
#       end
#       return @reading.references
#   end
