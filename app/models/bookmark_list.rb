class BookmarkList
  @api_data = {}
  @bookmarks = {}

  def total(user_id)
    api_data[user_id].total
  end

  def self.all(params = {page: nil})
    for_user(nil, :page => page)
  end

  def self.for_user(user_id = nil, params = {})
    key = user_id || 'default'
    page = params[:page] || 1

    hash = {}
    api_data(user_id, params).bookmarks.each do |b|
      targ = Bookmark.new(b)
      hash[b.id] = targ
    end
    @bookmarks["#{key}_#{page}"] = Hashie::Mash.new(hash)
  end

  # TODO: Memoizing this is likely expensive and unnecessary. Need to cogitate some
  # more on it.
  def self.api_data(user_id = nil, params = {})
    page = params[:page] || 1
    key = "#{user_id || 'default'}_#{page}"

    unless @api_data.has_key?(key)
      args = ["bookmarks/items"]
      opts = {page: page}
      opts.merge!(user_id: user_id) if user_id
      args << opts
      @api_data[key] = YvApi.get(*args)
    end
    @api_data[key]
  end

  def api_data(user_id = nil)
    self.class.api_data(user_id)
  end

end
