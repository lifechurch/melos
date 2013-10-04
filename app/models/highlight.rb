# TODO: 3.1
# - #update API call (when implemented)
# - #chapters API call (when implemented)
# - map attributes to new API response
# - rework all create calls to send new references format
# - write any appropriate tests
# - ensure search#notes properly works
# - implement code for translated moment title

class Highlight < YV::Resource

  include YV::Concerns::Icons
  include YV::Concerns::Avatars
  include YV::Concerns::Actionable
  include YV::Concerns::Commentable
  include YV::Concerns::Identifiable

  attribute :color
  attribute :reference
  attribute :references
  attribute :version

  class << self

    # Override paths to make calls to 3.1 API for Moments
      def list_path
        "moments/items"
      end

      def resource_path
        "moments/view"
      end

      def delete_path
        "moments/delete"
      end

      def colors_path
        "moments/colors"
      end

    # Override all method to add highlight kind to options
    def all(opts={})
      raise "Page parameter is required" unless opts[:page]
      opts[:kind] = "highlight"
      super(opts)
    end


    # Highlight.colors(opts)
    # http://developers.youversion.com/api/docs/3.1/sections/moments/colors.html
    # ------------------------------------------------------------------------------------------------------------
    # returns a YV::API::Results decorator for an array of hexidecimal color values
    
    # options
    # * auth: optional {auth: auth_hash}

    # example API data
    # {"response"=>
    #   {"code"=>200,
    #    "data"=>["fffeca", "fffe93", "fffe00", "beffaa", "a3ffa8", "5dff79", "a6f7ff", "56f3ff", "00d6ff", "e9e5ff", "ffcaf7", "ff95ef", "ffe5d3", "ffc66f"], "buildtime"=>"2013-09-26T21:20:32+00:00"}}


    def colors(opts={})
      data, errs = get(colors_path, opts.slice(:auth))
      return YV::API::Results.new(data,errs)
    end
    

    # API Method
    # Returns a ResourceList of Highlight instances with a given reference
    # Returns nil if no :auth option is given
    # valid options
    # - auth            scopes API call to find hilights for auth user & reference
    def for_reference(reference, params = {})
      reference = Reference.new(reference) unless reference.is_a? Reference
      params[:page] ||= 1
      opts = params.merge(reference: reference.chapter_usfm, version_id: reference.version)

      data, errs = get("highlights/chapter", opts)
      results = YV::API::Results.new(data,errs)
      
      unless results.valid?
        data = [] if results.has_error?("note found")
      else
        list = ResourceList.new
        list.total = data.total
          data.highlights.each do |h|
            list << new(h)
          end
        return list
      end

    end

  end
  # End class methods ----------------------------------------------------------------------------------------------

  # Custom persistence for new Moments API
  def persist(path)
    return persist_moment(attributes.merge(kind: "highlight"))
  end

  # See included YV::Concerns
  def build(results)
    process_icons(results)
    process_avatars(results)
    process_comments(results)
    process_actionable(results)
    process_identifiable(results)
  end

  def after_update(results)
    build(results)
  end

  def after_save(results)
    build(results)
  end
  

  def after_build
      usfm_ref = case reference
      when String       #usfm style string coming from user creation
        attributes.reference
      when Hashie::Mash #Mash coming back from existing highlight in API
        attributes.reference.usfm
      end

      # if the versid_id isn't passed, then the reference
      # string will (should) have it
      self.version = attributes.try :version_id

      # if a version ID is specified, use it as the overriding version
      forced_opts = self.version.nil? ? {} : {version: self.version}

      # note: it is possible we're creating a highlight from an id alone
      # so it's not necessarrily an error if we don't have a usfm_ref
      self.reference = Reference.new(usfm_ref, forced_opts) if usfm_ref

      # in case the version_id wasn't available above
      # and was passed in the ref string
      self.version ||= self.reference.try :version
  end

  def before_save
    #ref = self.reference.is_a?(Reference) ? self.reference : Reference.new(self.reference) # self.reference could be a string
    #self.attributes.version_id = self.reference.version
    #self.reference = ref.to_usfm
  end


  def as_json(options = {})
    #API/apps shouldn't support ranged highlights, but some exist, so use only the first verse if range.
    #EVENTUALLY: make this pervasive/complete so anyone using this object only sees the 1st verse and we can just pass raw_hash[:verses]
    {verse: self.reference.verses.first, color: self.color, id: id, version: version}
  end

end
