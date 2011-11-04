class Bookmark
  @@api_data = {}

  def initialize(params = {})
    reg_data = {user_id: nil}
    reg_data.merge! params
    reg_data.each do |k,v|
      # Create an accessors and set the initial values for all the params
      self.class.send(:attr_accessor, k)
      self.send("#{k}=", v)
    end
  end

  def attributes(*args)
    array = args
    array = self.instance_variables.map { |e| e.to_s.gsub("@", "").to_sym} if array == []
    attrs = {}
    array.each do |var|
      attrs[var] = instance_variable_get("@#{var}")
    end
    attrs
  end

  attr_reader :errors

  def self.find(id)
    opts = {id: id}
    data = YvApi.get('bookmarks/view', opts) do |errors|
      Rails.logger.info "API Error: Bookmark.find(#{id}) got these errors: #{errors.inspect}"
      if errors.include? "not_found"
        # return empty hash to avoid raising exception
        { }
      end
    end
    # If we got valid data back from API, use it; otherwise return nil.
    Bookmark.new(data) if data.is_a? Hashie::Mash
  end

  def save
    opts = attributes(:highlight_color, :labels, :reference, :title, :version)
    # TODO: find the real username and pass
    opts.merge! ({auth_username: 'testuser', auth_password: 'tenders'})
    response = YvApi.post('bookmarks/create', opts) do |errors|
      @errors = errors.map { |e| e["error"] } if errors
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

  # TODO: Memoizing this is likely expensive and unnecessary. Need to cogitate some
  # more on it.
  def self.api_data(user_id = nil, params = {})
    page = params[:page] || 1
    key = "#{user_id || 'default'}_#{page}"
    unless @@api_data.has_key?(key)
      opts = {page: page}
      opts[:user_id] = user_id if user_id
      @@api_data[key] = YvApi.get('bookmarks/items', opts)
    end
    @@api_data[key]
  end

  def api_data(user_id = nil)
    self.class.api_data(user_id)
  end

end
