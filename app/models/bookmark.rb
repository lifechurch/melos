# TODO: 3.1
# - #update API call (when implemented)
# - #labels API call (when implemented)
# - map attributes to new API response
# - rework all create calls to send new references format
# - write any appropriate tests
# - ensure search#notes properly works
# - implement code for translated moment title


class Bookmark < YV::Resource

  include YV::Concerns::Icons
  include YV::Concerns::Avatars
  include YV::Concerns::Actionable
  include YV::Concerns::Commentable
  include YV::Concerns::Identifiable

  attribute :title
  attribute :labels
  attribute :user_id
  attribute :version
  attribute :version_id
  attribute :reference
  attribute :references
  attribute :highlight_color

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


    # Override all method to add bookmark kind to options
    def all(opts={})
      raise "Page parameter is required" unless opts[:page]
      opts[:kind] = "bookmark"
      super(opts)
    end


    # API Method
    # Lookup all bookmarks with a given label and params
    # Returns a ResourceList of bookmark instances
    def for_label(label, params = {})
      page = params[:page] || 1
      opts = params.merge({label: label, page: page})
      return all(opts)
    end


    # API Method
    # Lookup all bookmarks for a given user_id and params
    # Returns a ResourceList of bookmark instances
    def for_user(user_id = nil, params = {})
      page = params[:page] || 1
      opts = params.merge({user_id: user_id, page: page})
      return all(opts)
    end


    # API Method
    # Lookup bookmark labels (tags) for a given user_id
    # Returns a ResourceList of label Hashie::Mashs
    # TODO: create class for labels

    def labels_for_user(user_id, params = {})
      params[:page] ||= 1

      data, errs = get("bookmarks/labels", user_id: user_id, page: params[:page])
      results = YV::API::Results.new(data,errs)

      unless results.valid?
        if results.has_error?("Labels not found")
           data = Hashie::Mash.new(labels: [], total:0)
        else
           raise_errors(results.errors, "Bookmark#labels_for_user")
        end
      end

      if data.labels
         labels = ResourceList.new(data.labels)
         labels.total = data.total
      else
         labels = ResourceList.new([])
         labels.total = 0
      end
      return labels
    end

  end
  # END class methods ----------------------------------------------------------------------------------------------




  # Custom persistence for new Moments API
  def persist(path)
    return persist_moment(attributes.merge(kind: "bookmark"))
  end

  # See included YV::Concerns
  def build(results)
    process_icons(results)
    process_avatars(results)
    process_comments(results)
    process_actionable(results)
    process_identifiable(results)
  end

  def user_id
    self.attributes['user_id']
  end

  # Called after initialization
  def after_build
    build(self.attributes)
    # self.reference does multiple duty here for the moment. When creating a new object,
    # self.reference may contain whatever the user passed in (usually a String) with the
    # :reference key.  When creating an object from an API call, it will bear whatever
    # string the API returned for the 'reference' key in the response->data section.
    # And it could probably be some other things before we're done.
    self.version = attributes.try :[], :version_id
    self.reference_list = ReferenceList.new(self.references, self.version)
    self.version = self.reference_list.first.try :version
  end

  def before_save
    #self.references = self.reference_list.to_flat_usfm
    #self.version_id = self.version
  end

  def after_save(results)
    return unless results
    build(results)
    
    self.version = Version.find(results.version_id)
    # Sometimes references come back as an array, sometimes just one, Hashie::Mash
    if results.references
      self.reference_list = ReferenceList.new(self.references, self.version)
    end
  end

  def after_update(results)
    build(results)
  end



  def update(fields)
    # API allows only title, labels, and highlight_color to be updated
    allowed_keys = [:title, :labels, :highlight_color, "title", "labels", "highlight_color"]
    fields.delete_if {|k, v| ! allowed_keys.include? k}
    super
  end

end
