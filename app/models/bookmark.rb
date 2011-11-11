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
    osis = if response.reference && response.reference.respond_to?(:osis)
      response.reference.osis
    else
      Model::hash_to_osis(response.reference)
    end
    self.reference = Reference.new("#{osis}.#{response.version}")
  end
  
  def before_update
    self.reference = self.reference.map(&:osis).join("%2b") if self.reference.is_a?(Array)
  end
  
  def after_update(response)
    self.reference = Reference.new("#{Model::hash_to_osis(response.reference)}.#{response.version}")
  end
  
  def after_build
    if self.reference.is_a?(Array)
      self.references = self.reference.map { |n| Reference.new("#{n.osis}.#{self.version}") }
    end
  end

  def old_save(auth = nil)
    opts = attributes(:highlight_color, :labels, :reference, :title, :version)
    # TODO: find the real username and pass
    opts.merge! ({auth_username: 'testuser', auth_password: 'tenders'})
    response = YvApi.post('bookmarks/create', opts) do |errors|
      @errors = errors.map { |e| e["error"] } if errors
      return false
    end
    @id = response.id
    response
  end

  # TODO: add a destroy class method that accepts multiple IDs in an array
  def destroy
    opts = {ids: id, auth: self.auth}

    puts "Calling: Bookmark.destroy(#{id}, #{opts})"
    response = YvApi.post('bookmarks/delete', opts) do |errors|
      @errors = errors.map { |e| e["error"] }
      return false
    end
    response
  end

  def update(fields)
    # In API version 2.3, only title, labels, and highlight_color can be updated
    allowed_keys = [:title, :labels, :highlight_color]

    # Clear out the ones we can't update.
    fields.delete_if {|k, v| ! allowed_keys.include? k}

    # token = Digest::MD5.hexdigest "#{auth.username}.Yv6-#{auth.password}"

    opts = {id: id, auth: self.auth}
    opts.merge! fields
    puts "Calling: YvApi.post('bookmarks/update', #{opts})"
    response = YvApi.post('bookmarks/update', opts) do |errors|
      @errors = errors.map { |e| e["error"] }
      return false
    end
    response
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
