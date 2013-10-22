# TODO: 3.1
# - #update API call (when implemented)
# - #labels API call (when implemented)
# - map attributes to new API response
# - rework all create calls to send new references format
# - write any appropriate tests
# - ensure search#notes properly works
# - implement code for translated moment title


class Bookmark < YV::Resource

  api_response_mapper YV::API::Mapper::Bookmark

  attribute :moment_title

  attribute :title
  attribute :labels
  attribute :created_dt
  attribute :avatars
  attribute :icons  
  attribute :created_dt
  attribute :updated_dt
  
  attribute :user_id
  attribute :kind_id
  attribute :kind_color

  attribute :comments
  attribute :commenting
  attribute :comments_count

  attribute :references
  attribute :color



  # The following fields are utilized for form submits. 
  # A plus separated list of usfm refs GEN.1.1+GEN.1.2
    attribute :usfm_references

  # A numeric version id submitted to associate references with a version id for bookmarking.
    attribute :version_id

  attr_accessor :reference_list

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

      def update_path
        "moments/update"
      end

      def create_path
        "moments/create"
      end


    # Override all method to add bookmark kind to options
    def all(opts={})
      raise "Page parameter is required" unless opts[:page]
      super(opts.merge(kind: "bookmark"))
    end


    # API Method
    # Lookup all bookmarks with a given label and params
    # Returns a ResourceList of bookmark instances
    def for_label(label, params = {})
      opts = params.merge({label: label, page: params[:page] || 1})
      return all(opts)
    end


    # API Method
    # Lookup all bookmarks for a given user_id and params
    def for_user(user_id = nil, params = {})
      opts = params.merge({user_id: user_id, page: params[:page] || 1})
      return all(opts)
    end


    # API Method
    # Lookup bookmark labels (tags) for a given user_id
    # Returns a ResourceList of label Hashie::Mashs
    # TODO: create class for labels

    def labels_for_user(user_id, opts={})
      data, errs = get( labels_path , opts.merge(user_id: user_id).slice(:auth,:user_id))
      return results = YV::API::Results.new(data,errs)
      # [["wild", 1],
      #  ["wildernessy", 1],
      #  ["things", 1],
      #  ["crying", 1],
      #  ["seven", 2],
      #  ["days", 2],
      #  ["rest", 2]]
    end

    def labels_path
      "moments/labels"
    end

  end
  # END class methods ----------------------------------------------------------------------------------------------


  def labels=(labes)
    build_labels(labes)
  end


  # Custom persistence for new Moments API
  # Takes care of #create and #update requirements by passing 'kind' option.c
  def persist(path)
    return persist_moment(path,attributes.merge(kind: "bookmark").slice(:id,:auth,:kind,:title,:references,:labels, :created_dt))
  end

  def before_save
    set_created_dt
  end


  # See included YV::Concerns

  def user_id
    self.attributes['user_id']
  end

  # Called after initialization
  def after_build

    build_references
    build_labels(self.labels)

    # self.reference does multiple duty here for the moment. When creating a new object,
    # self.reference may contain whatever the user passed in (usually a String) with the
    # :reference key.  When creating an object from an API call, it will bear whatever
    # string the API returned for the 'reference' key in the response->data section.
    # And it could probably be some other things before we're done.
    # self.version = attributes.try :[], :version_id
    # self.reference_list = ReferenceList.new(self.references, self.version)
    # self.version = self.reference_list.first.try :version
  end

  def build_references
    return unless usfm_references and version_id
    usfms = usfm_references.split("+")
    self.references = usfms.collect {|usfm| {usfm: [usfm], version_id: version_id } }
    
    #refererences = [
    #  {usfm:["GEN.1.1","GEN.1.2"], version_id: 1}
    #]
  end

  def build_labels(labes)
    self.attributes["labels"] = case labes
      when nil    then []
      when Array  then labes
      when String then labes.split(",")
    end
  end



  def after_save(results)
    return unless results
    
    #self.version = Version.find(results.version_id)
    # Sometimes references come back as an array, sometimes just one, Hashie::Mash
    #if results.references
    #  self.reference_list = ReferenceList.new(self.references, self.version)
    #end
  end

  def after_update(results)
    #build(results)
  end



  def update(fields)
    # API allows only title, labels, and highlight_color to be updated
    allowed_keys = [:title, :labels, :highlight_color, "title", "labels", "highlight_color"]
    fields.delete_if {|k, v| ! allowed_keys.include? k}
    super
  end


  def moment_partial_path
    "moments/bookmark"
  end

  def to_path
    "/bookmarks/#{id}"
  end

end
