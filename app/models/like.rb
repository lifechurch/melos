class Like < YvModel

  attr_reader :errors, :note_id, :note_title, :note_url, :note_user_avatar_url, :note_user_id, :note_username, :user_avatar_url, :user_id, :username, :id
  attr_accessor :auth, :note_id
  set_defaults(id: nil, auth: nil, exists: nil)
  
  def self.foreign_key
    "like_id"
  end

  def to_param
    id
  end

  def note
    Note.find(note_id)
  end

  def self.for_note(note_id, user_id = nil)
    @return_like = nil

    response = YvApi.get('likes/items', user_id: user_id) do |errors|
      @errors = errors.map { |e| e["error"] }
      return nil
    end

    @likes = build_objects(response.likes, nil)
    @likes.each do |like|
      if like.note_id == note_id
        @return_like = like
      end
    end
    @return_like
  end

  def for_note(note_id, user_id = nil)
    self.class.for_note(note_id, user_id)
  end

  def self.all(user_id = nil)
    response = YvApi.get('likes/items', user_id: user_id) do |errors|
      @errors = errors.map { |e| e["error"] }
      return false
    end

    build_objects(response.likes, nil)
  end

  def all(user_id = nil)
    self.class.all(user_id)
  end

  def self.update(note_id, auth)
    like = for_note(note_id, auth.user_id)
    if like.nil?
      like = Like.new
      like.auth = auth
      like.note_id = note_id
      like.save(false)
    else
      like.auth = auth
      like.save(true)
    end
  end

  def save(exists)
    @token = Digest::MD5.hexdigest "#{@auth.username}.Yv6-#{@auth.password}"
    endpoint = !exists ? "likes/create" : "likes/delete"
    attrs = attributes(:note_id, :token, :auth)
    response = YvApi.post(endpoint, attrs) do |errors|
      @errors = errors.map { |e| e["error"] }
      return false
    end
    response
  end

  private

  def self.build_object(response, auth)
    @like = Like.new(response.merge(auth: auth))
  end

  def self.build_objects(response, auth)
    @return_likes = []
    response.each do |like|
      @return_likes << build_object(like, auth)
    end
    @return_likes
  end

end
