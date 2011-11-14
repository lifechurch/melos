class Bookmark < YouVersion::Resource

  attribute :highlight_color
  attribute :labels
  attribute :reference
  attribute :version
  attribute :title

  def before_save
    self.reference = self.reference.map(&:osis).join("%2b") if self.reference.is_a?(Array)
  end

  def after_save(response)
    return unless response
    # Sometimes references come back as an array, sometimes just one, Hashie::Mash
    osis = [response.reference].flatten.map(&:osis).join('+')
    self.reference = Reference.new("#{osis}.#{response.version}")
  end

  def before_update
    self.reference = self.reference.map(&:osis).join("%2b") if self.reference.is_a?(Array)
  end

  def after_update(response)
    return unless response
    osis = [response.reference].flatten.map(&:osis).join('+')
    self.reference = Reference.new("#{osis}.#{response.version}")
  end

  def after_build
    if self.reference.is_a?(Array)
      self.references = self.reference.map { |n| Reference.new("#{n.osis}.#{self.version}") }
    end
  end

  def update(fields)
    # In API version 2.3, only title, labels, and highlight_color can be updated
    allowed_keys = [:title, :labels, :highlight_color]

    # Clear out the ones we can't update.
    fields.delete_if {|k, v| ! allowed_keys.include? k}

    super
  end

  def self.for_user(user_id = nil, params = {})
    page = params[:page] || 1
    opts = {user_id: user_id, page: page}

    data = YvApi.get('bookmarks/items', opts) do |errors|
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
    bookmarks.total = data['total'].to_i if data['total']
    bookmarks
  end

end
