require 'digest/md5'

class User
  extend ActiveModel::Naming
  include ActiveModel::Conversion
  include Model
  attr_accessor :username, :password, :errors
  def persisted?
    !id.blank?
  end

  def self.foreign_key
    "user_id"
  end

  def self.authenticate(username, password)
    hash = {}
    response = YvApi.get('users/authenticate', auth_username: username, auth_password: password) { return nil }.to_hash
    if response
      hash[:username] = response.delete("username")
      hash[:id] = response.delete("id")
      hash[:password] = password
      hash[:info] = Hashie::Mash.new(response)
      hash[:auth] = Hashie::Mash.new(user_id: hash[:id], username: hash[:username], password: [password])
      User.new(hash)
    end
  end

  def self.id_key_for_version
    case Cfg.api_version
    when "2.3"
      :user_id
    when "2.4"
      :id
    else
      :user_id
    end
  end

  def self.find(user, opts = {})
    # Pass in a user_id, username, or just an auth mash with a username and id.
    case user
    when Fixnum
      if opts[:auth] && user == opts[:auth].user_id
        hash = YvApi.get("users/view", id_key_for_version => user, auth => opts[:auth]).to_hash
      else
        hash = YvApi.get("users/view", id_key_for_version => user).to_hash
      end
      hash[:auth] = opts[:auth] ||= nil
      User.new(hash)
    when Hashie::Mash
      hash = YvApi.get("users/view", id: user.user_id, auth: user).to_hash
      hash[:auth] = user
      User.new(hash)
    when String
      raise ArgumentError, "Strings not supported yet as value type for 'user' param in User.find"
      # User.new(YvApi.get("users/view", user_id: ### Need an API method here ###, auth: auth))
    end
  end

  # Contains defaults for when a new user is being created
  def initialize(params = {})
    params[:agree] = true if params[:agree]
    reg_data = {id: nil, email: "", username: "", password: "", verified: false, agree: false}.merge!(params)
    reg_data[:id] = reg_data[:id].to_i # If it came back from the API
    reg_data.each do |k,v|
      # Create an accessors and set the initial values for all the params
      self.class.send(:attr_accessor, k)
      self.send("#{k}=", v)
    end
  end

  # def self.find(id)
  #   response = YvApi.get('users/view', {:user_id => id, :auth_user_id => :id} ) do |errors|     
  #     @errors = errors.map { |e| e["error"] }
  #     return false
  #   end
  #   User.new(response)
  # end

  def self.notes(id, auth)
    Note.for_user(id, auth: auth)
  end
  
  def notes
    Note.for_user(self.id, self.auth)
  end

  def self.bookmarks(id, auth)
    Bookmark.for_user(id, auth: auth)
  end
  
  def bookmarks
    Bookmark.for_user(self.id, self.auth)
  end

  def likes
    Like.find(id, auth)
  end

  def create
    @token = Digest::MD5.hexdigest "#{@username}.Yv6-#{@password}"
    @secure = true
    response = YvApi.post('users/create', class_attributes(:email, :username, :password, :verified, :agree, :token, :secure)) do |errors|
      @errors = errors.map { |e| e["error"] } if errors
      return false
    end    
    response
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

  def bookmarks
    Bookmark.for_user(id)
  end
end
