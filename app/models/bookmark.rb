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

  def self.for_user(user_id = nil, params = {})
    key = user_id || 'default'
    page = params[:page] || 1

    hash = {}
    api_data(user_id, params).bookmarks.each do |b|
      hash[b.id] = {
        user_id: b.user_id,
        version: b.version,
        created: b.created,
        username: b.username,
        labels: b.labels,
        highlight_color: b.highlight_color,
        title: b.title,
        reference: b.reference.osis,
        labels: b.labels,
        highlight_color: b.highlight_color,
        reference_chapter: b.reference_chapter,
        references: b.references
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
