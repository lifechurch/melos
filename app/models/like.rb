class Like
  extend ActiveModel::Naming
  include ActiveModel::Conversion
  include Model
  def persisted?
    return !id.blank?
  end

  attr_reader :errors

  def initialize(params = {})
    reg_data = {id: nil, note_id: nil, auth: nil}
    initialize_class(self, params, reg_data)
  end

  def to_param
    puts "listening"
    id
  end

  def note
    Note.find(note_id)
  end

  def self.for_note(note_id, user_id = nil, auth = nil)
    @return_like = nil

    response = YvApi.get('likes/items', user_id: user_id) do |e|
      @errors = errors.map { |e| e["error"] }
      return false
    end

    @likes = build_objects(response.likes, auth)
    @likes.each do |like|
      if like.note_id == note_id
        @return_like = like
      end
    end

    @return_like
  end

  def for_note(note_id, user_id = nil)
    self.class.for_note(note_id, user_id, auth)
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
    unless @like = for_note(note_id)
      @like = Like.new(auth: auth, note_id: note_id)
      @like.create
    else
      @like.auth = auth
      @like.note_id = note_id
      @like.destroy
    end
  end

  def create
    @token = Digest::MD5.hexdigest "#{auth.username}.Yv6-#{auth.password}"

    response = YvApi.post('likes/create', class_attributes(:note_id, :token, :auth)) do |errors|
      @errors = errors.map { |e| e["error"] }
      return false
    end
    @id = response.id
    response
  end

  def destroy
    response = YvApi.post('likes/delete', class_attributes(:note_id, :auth)) do |errors|
      @errors = errors.map { |e| e["error"] }
      return false
    end
    response
  end

  private

  def self.build_object(response, auth)
    @like = Like.new(response)
    @like.auth = auth
    @like
  end

  def self.build_objects(response, auth)
    @return_likes = []
    response.each do |like|
      @return_likes << build_object(like, auth)
    end
    @return_likes
  end

end
