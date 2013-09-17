class Bookmark < YV::Resource

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
    
    # API Method
    # We have to override the default Resource version of this, because
    # the Bookmark API delete_path wants :ids instead of :id
    def destroy(id, auth = nil)
      data, errs = post(delete_path, {ids: id, auth: auth})
      return YV::API::Results.new(data,errs)
    end


    # API Method
    # Lookup all bookmarks with given params
    # Returns a ResourceList of bookmark instances
    def all(params = {})
      params[:page] ||= 1
      opts = params

      results = all_raw(opts)
      if results.has_error?("Bookmarks not found")
        return nil
      else
        return build_resource_list(results.data)
      end
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

    private

    # Private class method to build up a resource list for all_raw data returned via the API
    # used for all, for_user, for_label API methods
    def build_resource_list(data, opts = {})
      bookmarks = ResourceList.new
      if data['bookmarks']
        data.bookmarks.each do |b|
          bookmarks << Bookmark.new(b)
        end
        bookmarks.page = opts[:page].to_i
        bookmarks.total = data['total'].to_i if data['total']
      end
      return bookmarks
    end

  end
  # END class methods ----------------------------------------------------------------------------------------------


  def user_id
    self.attributes['user_id']
  end

  def after_build
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
    self.references = self.reference_list.to_flat_usfm
    self.version_id = self.version
  end

  def after_save(response)
    return unless response
    self.version = Version.find(response.version_id)
    # Sometimes references come back as an array, sometimes just one, Hashie::Mash
    if response.references
      self.reference_list = ReferenceList.new(self.references, self.version)
    end
  end


  def update(fields)
    # API allows only title, labels, and highlight_color to be updated
    allowed_keys = [:title, :labels, :highlight_color, "title", "labels", "highlight_color"]
    fields.delete_if {|k, v| ! allowed_keys.include? k}
    super
  end

end
