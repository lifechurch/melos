require 'digest/md5'

class User < YouVersion::Resource
  # include Model

  attribute :id
  attribute :username
  attribute :password
  attribute :email
  attribute :agree
  attribute :verified
  attribute :user_avatar_url
  attribute :first_name
  attribute :last_name
  attribute :location
  attribute :im_type
  attribute :im_username
  attribute :phone_mobile
  attribute :language_tag
  attribute :country
  attribute :timezone
  attribute :postal_code
  attribute :bio
  attribute :birthdate
  attribute :gender
  attribute :website
  attribute :twitter
  attribute :facebook
  attribute :google
  attribute :created_dt
  attribute :last_login_dt

  has_many_remote :badges

  def self.update_path
    "users/update_profile"
  end

  def self.create_path
    "users/create"
  end

  def name
    return nil unless first_name && last_name
    "#{first_name} #{last_name}"
  end

  def to_param
    self.username
  end

  # def badges
  #   Badge.all(user_id: self.id)
  # end

#   def persisted?
#     !id.blank?
#   end
# 
#   def self.foreign_key
#     "user_id"
#   end

class << self

  def authenticate(username, password)
    hash = {}
    response = YvApi.get('users/authenticate', auth_username: username, auth_password: password) { return nil }.to_hash
    if response
      response = response.symbolize_keys
      response[:auth] = Hashie::Mash.new(user_id: response[:id].to_i, username: response[:username], password: password)
      new(response)
    end
  end

  def id_key_for_version
    case Cfg.api_version
    when "2.3"
      :user_id
    when "2.4"
      :id
    when "2.5"
      :id
    else
      :user_id
    end
  end

  def find(user, opts = {})
    # Pass in a user_id, username, or just an auth mash with a username and id.
    case user
    when Fixnum
      if opts[:auth] && user == opts[:auth].user_id
        hash = YvApi.get("users/view", id_key_for_version => user, :auth => opts[:auth]).to_hash.symbolize_keys
      else
        hash = YvApi.get("users/view", id_key_for_version => user).to_hash.symbolize_keys
      end
      hash[:auth] = opts[:auth] ||= nil
    when Hashie::Mash
      hash = YvApi.get("users/view", id: user.user_id, auth: user).to_hash.symbolize_keys
      hash[:auth] = user
    when String
      response = YvApi.get("users/user_id", username: user)
      puts "response.user_id is #{response.user_id}"
      if opts[:auth] && user == opts[:auth].username
        hash = YvApi.get("users/view", id_key_for_version => response.user_id, :auth => opts[:auth]).to_hash.symbolize_keys
      else
        hash = YvApi.get("users/view", id_key_for_version => response.user_id).to_hash.symbolize_keys
      end
      hash[:auth] = opts[:auth] ||= nil
      # case user
      # when /\s*\d+\s*/      # It's just a number in string form
      #   hash = YvApi.get("users/view", id_key_for_version => user.to_i).to_hash.symbolize_keys
      #   hash[:auth] = user
      # when /username-type-pattern/
      #   hash = YvApi.get find-by-username-yay
      # User.new(YvApi.get("users/view", user_id: ### Need an API method here ###, auth: auth))
    end
    usr = User.new(hash)
    usr
  end
end

  def initialize(data = {})
    puts "hey, data is #{data}"
    data["agree"] = (data["agree"] == "1") unless data.blank?
    @attributes = data
    @associations = {}

    after_build
  end

  def persist_token
    Digest::MD5.hexdigest "#{self.username}.Yv6-#{self.password}"
  end
  def before_save
    puts "i'm in before create"
    # opts = {"email" => "", "username" =>  "", "password" =>  "", "verified" => false, "agree" => false}.merge!(opts)
    # opts["token"] = Digest::MD5.hexdigest "#{self.username}.Yv6-#{self.password}"
    # opts["agree"] = true if opts["agree"]
    # opts[:secure] = true
    self.attributes[:secure] = true
    puts self.attributes
    self.attributes["notification_settings[newsletter][email]"] = true
    # errors = nil
    # response = YvApi.post('users/create', opts) do |ee|
    #   errors = ee
    #   return false
    # end    
    # return errors || true
  end

  def confirm(hash)
    YvApi.post("users/confirm", hash: hash) do |errors|
      new_errors = errors.map { |e| e["error"] }
    end
  end

  def before_update; end

  # def self.find(id)
  #   response = YvApi.get('users/view', {:user_id => id, :auth_user_id => :id} ) do |errors|     
  #     @errors = errors.map { |e| e["error"] }
  #     return false
  #   end
  #   User.new(response)
  # end

#   def self.notes(id, auth)
#     Note.for_user(id, auth: auth)
#   end
#   
  def notes(opts = {})
    Note.for_user(self.id, opts.merge({auth: self.auth}))
  end
# 
#   def self.bookmarks(id, auth)
#     Bookmark.for_user(id, auth: auth)
#   end
  
  def bookmarks(opts = {})
    Bookmark.for_user(self.id, opts)
  end

  def likes
    Like.find(id, auth)
  end

  def recent_activity
    unless @recent_activity
      response = YvApi.get("community/items", user_id: self.id)
      if response.community
        activities = response.community.map do |a|
          a.type = "user" if a.type == "follow"
          a.type = "object" if a.type == "reading_plan_completed"
          a.type = "object" if a.type == "reading_plan_subscription"
          class_name = a.type.camelize.constantize
          a.data.map { |b| class_name.new(b) }
        end
        @recent_activity = activities.flatten
      end
    end
    @recent_activity
  end

  def update_picture(uploaded_file)
    image = Base64.strict_encode64(File.read(uploaded_file.path))
    response = self.class.post("users/update_avatar", image: image, auth: self.auth) do |errors|
      new_errors = errors.map { |e| e["error"] }
      self.errors[:base] << new_errors
      false
    end
    return response.true?
  end

  def devices
    Device.for_user(self.auth.user_id, auth: self.auth)
  end


  def connections
    connections = []
    connections << TwitterConnection.new(data: self.twitter.symbolize_keys, auth: self.auth.symbolize_keys) if self.twitter
    connections << FacebookConnection.new(data: self.facebook.symbolize_keys, auth: self.auth.symbolize_keys) if self.facebook
    connections
  end

  def following
    response = YvApi.get("users/following", id: self.id) do |errors|
      new_errors = errors.map { |e| e["error"] }
      self.errors[:base] << errors
      return false
    end
    if response
      followings = ResourceList.new
      followings.total = response.total
      response.users.each { |u| followings << User.new(u) }
      @following_id_list = followings.map { |u| u.username }
      followings
    end
  end

  def following_username_list
    @following_id_list ||= all_following
  end


  def followers
    response = YvApi.get("users/followers", id: self.id) do |errors|
      new_errors = errors.map { |e| e["error"] }
      self.errors[:base] << errors
      return false
    end
    if response
      fl = ResourceList.new
      fl.total = response.total
      response.users.each { |u| fl << User.new(u) }
      fl
    end
  end
#   def attributes(*args)
#     array = args
#     array = self.instance_variables.map { |e| e.to_s.gsub("@", "").to_sym} if array == []
#     attrs = {}
#     array.each do |var|
#       attrs[var] = instance_variable_get("@#{var}")
#     end
#     attrs
#   end
# 
#   def bookmarks
#     Bookmark.for_user(id)
#   end
end
