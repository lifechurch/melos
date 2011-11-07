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

  def self.find(user_id, auth = nil)
    response = YvApi.get('likes/items', user_id: user_id ) do |e|   # anonymous
      YvApi.get('likes/items', user_id: user_id, auth: auth) do |e| # auth'ed
        @errors = errors.map { |e| e["error"] }
        return false
      end
    end

    #TODO: Add code to find the object in the collection returned in 'response'

    #build_objects(response.likes, auth)
  end

  def find(user_id, auth)
    self.class.find(user_id, auth)
  end

  def self.all
    response = YvApi.get('likes/items') do |errors|
      @errors = errors.map { |e| e["error"] }
      return false
    end

    build_objects(response.likes, nil)
  end

  def all
    self.class.all
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

  def update(id, value, auth)



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
