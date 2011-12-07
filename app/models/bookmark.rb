class Bookmark < YouVersion::Resource

  attribute :highlight_color
  attribute :labels
  attribute :reference
  attribute :title
  attribute :version

  attr_accessor :reference_list

  def user_id
    self.attributes['user_id']
  end

  def before_save
    self.reference = self.reference_list.to_api_string
  end

  def after_save(response)
    Rails.logger.info "In Bookmark.after_save, response is:"
    Rails.logger.info "*"*80
    Rails.logger.info response
    Rails.logger.info "*"*80
    return unless response
    return
    # Sometimes references come back as an array, sometimes just one, Hashie::Mash
    if response.reference
      self.reference_list = ReferenceList.new(self.reference)
    end
  end

  def after_build

    # self.reference does multiple duty here for the moment. When creating a new object,
    # self.reference may contain whatever the user passed in (usually a String) with the
    # :reference key.  When creating an object from an API call, it will bear whatever
    # string the API returned for the 'reference' key in the response->data section.
    # And it could probably be some other things before we're done.
    self.reference_list = ReferenceList.new(self.reference, self.version)
    self.version =self.reference_list.first[:version]
    # Just here for compatibility - should return the same as what was done before
    # self.reference = self.reference_list.first
  end


  def update(fields)
    Rails.logger.info("==  Attempting to merge #{fields} into #{self.attributes}")
    # In API version 2.3, only title, labels, and highlight_color can be updated
    allowed_keys = [:title, :labels, :highlight_color]

    # Clear out the ones we can't update.
    fields.delete_if {|k, v| ! allowed_keys.include? k}

    Rails.logger.info("==  Will actually merge #{fields}")
    super
  end

  # We have to override the default Resource version of this, because
  # the Bookmark API delete_path wants :ids instead of :id
  def self.destroy(id, auth = nil, &block)
    post(delete_path, {:ids => id, :auth => auth}, &block)
  end

  def self.all(params = {})
    params[:page] ||= 1

    data = all_raw(params) do |errors|
      Rails.logger.info "API Error: Bookmark.all(#{params}) got these errors: #{errors.inspect}"
      if errors.find{|g| g['error'] =~ /Bookmarks not found/}
        # return empty hash to avoid raising exception
        { }
      end
    end

    bookmarks = ResourceList.new
    if data['bookmarks']
      data.bookmarks.each do |b|
        bookmarks << Bookmark.new(b) if b.is_a? Hashie::Mash
      end
    end
    bookmarks.page = params[:page]
    bookmarks.total = data['total'].to_i if data['total']
    bookmarks
  end

  def self.for_label(label, params = {})
    page = params[:page] || 1
    opts = params.merge({label: label, page: page})

    data = all_raw(opts) do |errors|
      Rails.logger.info "API Error: Bookmark.for_label(#{label}) got these errors: #{errors.inspect}"
      if errors.find{|g| g['error'] =~ /Bookmarks not found/}
        # return empty hash to avoid raising exception
        { }
      end
    end

    bookmarks = ResourceList.new
    if data['bookmarks']
      data.bookmarks.each do |b|
        bookmarks << Bookmark.new(b) if b.is_a? Hashie::Mash
      end
    end
    bookmarks.page = opts[:page].to_i
    bookmarks.total = data['total'].to_i if data['total']
    bookmarks
  end

  def self.for_user(user_id = nil, params = {})
    page = params[:page] || 1
    opts = params.merge({user_id: user_id, page: page})

    data = all_raw(opts) do |errors|
      Rails.logger.info "API Error: Bookmark.for_user(#{user_id}) got these errors: #{errors.inspect}"
      if errors.find{|g| g['error'] =~ /Bookmarks not found/}
        # return empty hash to avoid raising exception
        { }
      end
    end

    bookmarks = ResourceList.new
    if data['bookmarks']
      data.bookmarks.each do |b|
        bookmarks << Bookmark.new(b) if b.is_a? Hashie::Mash
      end
    end
    bookmarks.page = opts[:page].to_i
    bookmarks.total = data['total'].to_i if data['total']
    bookmarks
  end

  def self.labels_for_user(user_id, params = {})
    params[:page] ||= 1
    response = get("bookmarks/labels", user_id: user_id, page: params[:page]) do |errors|
      Rails.logger.info "API Error: Bookmark.labels_for_user(#{user_id}) got these errors: #{errors.inspect}"
      if errors.find{|g| g['error'] =~ /Labels not found/}
        # return empty hash to avoid raising exception
        Hashie::Mash.new(labels: [], total:0) 
      else
        errors = errors.map { |ee| ee["error"] }
        raise YouVersion::ResourceError.new(errors)
      end
    end
    if response.labels
      @labels = ResourceList.new(response.labels)
      @labels.total = response.total
    else
      @labels = ResourceList.new([])
      @labels.total = 0
    end
    @labels
  end

  # Yeah, bite me
  def created_as_date
    Date.parse(attributes['created'])
  end
end
