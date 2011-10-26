class Bookmark
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
    args = ["bookmarks/view"]
    args << {id: id}
    data = YvApi.get(*args) do |errors|
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
    opts.merge! ({auth_username: 'testuser', auth_password: 'tenders'})
    response = YvApi.post('bookmarks/create', opts) do |errors|
      @errors = errors.map { |e| e["error"] } if errors
      return false
    end
    response
  end

  def self.for_user(user_id = nil, params = {})
    key = user_id || 'default'
    page = params[:page] || 1

    hash = {}
    api_data(user_id, params).bookmarks.each do |b|
      hash[b.id] = {
        created: b.created,
        highlight_color: b.highlight_color,
        labels: b.labels,
        reference: b.reference.osis,
        reference_chapter: b.reference_chapter,
        references: b.references,
        title: b.title,
        user_id: b.user_id,
        username: b.username,
        version: b.version
      }
    end
    @@bookmarks["#{key}_#{page}"] = Hashie::Mash.new(hash)
  end

  # TODO: Memoizing this is likely expensive and unnecessary. Need to cogitate some
  # more on it.
  def self.api_data(user_id = nil, params = {})
    page = params[:page] || 1
    key = "#{user_id || 'default'}_#{page}"

    unless @@api_data.has_key?(key)
      args = ["bookmarks/items"]
      args << {user_id: user_id} if user_id
      args << {page: page}
      @@api_data[key] = YvApi.get(*args)
    end
    @@api_data[key]
  end

  def api_data(user_id = nil)
    self.class.api_data(user_id)
  end

end
