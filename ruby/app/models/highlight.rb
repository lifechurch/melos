# TODO: 3.1
# - #update API call (when implemented)
# - #chapters API call (when implemented)
# - map attributes to new API response
# - rework all create calls to send new references format
# - write any appropriate tests
# - ensure search#notes properly works
# - implement code for translated moment title

class Highlight < YV::Resource

  include YV::Concerns::Moments

  attributes [:color,:labels,:references,:version_id,:usfm_references]
  api_response_mapper YV::API::Mapper::Highlight

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

      def create_path
        "moments/create"
      end

      def colors_path
        "moments/colors"
      end

      def kind
        "highlight"
      end

    # Override all method to add highlight kind to options
    def all(opts={})
      raise "Page parameter is required" unless opts[:page]
      opts[:kind] = kind
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
      get_results("moments/colors",opts.slice(:auth))
    end
    
    def by_reference(params={})
      all_moments = Moment.all(params.slice(:auth,:user_id,:usfm,:version_id))
      all_moments.reject {|moment| moment.class != self } 
      # TODO: Get API to implement filtering while passing a kind
      # would allow Highlight.all(params.slice(:auth,:user_id,:usfm,:version_id)) without the second 'reject' line of code.
    end

    # We want this returned:
    # [{"verse":"7","color":"83f52c","id":443295817,"version":1},{"verse":"1","color":"83f52c","id":443295815,"version":1},{"verse":"3","color":"67c8ff","id":266668516,"version":1}]

    def for_reader(params={})
      highlights  = by_reference(params)
      return highlights if highlights.blank?

      hs = highlights.collect do |h|
        {
          id: h.id,
          references: h.references,
          color: h.color
        }
      end
    end
  end
  # End class methods ----------------------------------------------------------------------------------------------


  # Override method in Concerns::Moments
  def editable?
    false
  end

  # Custom persistence for new Moments API
  def persist(path)
    return persist_moment(path,attributes.merge(kind: "highlight").slice(:kind, :color, :references, :auth, :created_dt))
  end

  def before_save
    set_created_dt
  end

  def after_build
    build_references

      # usfm_ref = case reference
      # when String       #usfm style string coming from user creation
      #   attributes.reference
      # when Hashie::Mash #Mash coming back from existing highlight in API
      #   attributes.reference.usfm
      # end
# 
      # # if the versid_id isn't passed, then the reference
      # # string will (should) have it
      # self.version = attributes.try :version_id
# 
      # # if a version ID is specified, use it as the overriding version
      # forced_opts = self.version.nil? ? {} : {version: self.version}
# 
      # # note: it is possible we're creating a highlight from an id alone
      # # so it's not necessarrily an error if we don't have a usfm_ref
      # self.reference = Reference.new(usfm_ref, forced_opts) if usfm_ref
# 
      # # in case the version_id wasn't available above
      # # and was passed in the ref string
      # self.version ||= self.reference.try :version
  end

  #def as_json(options = {})
    #API/apps shouldn't support ranged highlights, but some exist, so use only the first verse if range.
    #EVENTUALLY: make this pervasive/complete so anyone using this object only sees the 1st verse and we can just pass raw_hash[:verses]
  #  {verse: self.reference.verses.first, color: self.color, id: id, version: version}
  #end

end