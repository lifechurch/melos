class Like < YouVersion::Resource

  attribute :errors
  attribute :note_id
  attribute :note_title
  attribute :note_url
  attribute :note_user_avatar_url
  attribute :note_user_id
  attribute :note_username
  attribute :user_avatar_url
  attribute :user_id
  attribute :username
  attribute :id

  def to_param
    id
  end

  def note
    Note.find(note_id)
  end

  def self.for_user(user_id = nil, params = {})
    page = params[:page] || 1
    opts = params.merge({user_id: user_id, page: page})

    data = all_raw(opts) do |errors|
      Rails.logger.ap "API Error: Likes.for_user(#{user_id}) got these errors: #{errors.inspect}", :info
      if errors.find{|g| g['error'] =~ /Likes not found/}
        # return empty hash to avoid raising exception
        { }
      end
    end

    likes = ResourceList.new
    if data['likes']
      data.likes.each do |l|
        likes << Like.new(l) if l.is_a? Hashie::Mash
      end
    end
    likes.page = opts[:page].to_i
    likes.total = data['total'].to_i if data['total']
    likes
  end

  # def self.for_note(note_id, user_id = nil)
  #   @return_like = nil
  #
  #   response = YvApi.get('likes/items', user_id: user_id) do |errors|
  #     @errors = errors.map { |e| e["error"] }
  #     return nil
  #   end
  #
  #   @likes = build_objects(response.likes, nil)
  #   @likes.each do |like|
  #     if like.note_id == note_id
  #       @return_like = like
  #     end
  #   end
  #   @return_like
  # end
  #
  # def for_note(note_id, user_id = nil)
  #   self.class.for_note(note_id, user_id)
  # end

  # def self.all(user_id = nil)
  #    response = YvApi.get('likes/items', user_id: user_id) do |errors|
  #      @errors = errors.map { |e| e["error"] }
  #      return false
  #    end
  #
  #    build_objects(response.likes, nil)
  #  end

  # def all(user_id = nil)
  #   self.class.all(user_id)
  # end

  # def self.update(note_id, auth)
  #   like = for_note(note_id, auth.user_id)
  #   if like.nil?
  #     like = Like.new
  #     like.auth = auth
  #     like.note_id = note_id
  #     like.save(false)
  #   else
  #     like.auth = auth
  #     like.save(true)
  #   end
  # end

  # def save(exists)
  #   @token = Digest::MD5.hexdigest "#{@auth.username}.Yv6-#{@auth.password}"
  #   endpoint = !exists ? "likes/create" : "likes/delete"
  #   attrs = attributes(:note_id, :token, :auth)
  #   response = YvApi.post(endpoint, attrs) do |errors|
  #     @errors = errors.map { |e| e["error"] }
  #     return false
  #   end
  #   response
  # end
  #
  # private
  #
  # def self.build_object(response, auth)
  #   @like = Like.new(response.merge(auth: auth))
  # end
  #
  # def self.build_objects(response, auth)
  #   @return_likes = []
  #   response.each do |like|
  #     @return_likes << build_object(like, auth)
  #   end
  #   @return_likes
  # end

end
