require 'digest/md5'

class User
  extend ActiveModel::Naming
  include ActiveModel::Conversion
  include Model
  attr_accessor :username, :password, :errors
  def persisted?
    !id.blank?
  end

  def self.authenticate(username, password)
    hash = {}
    response = YvApi.get('users/authenticate', auth_username: username, auth_password: password) { return nil }.to_hash
    if response
      hash[:username] = response.delete("username")
      hash[:id] = response.delete("id")
      hash[:password] = password
      hash[:info] = Hashie::Mash.new(response)
      User.new(hash)
    end
  end

  def self.find(user, auth = nil)
    # Pass in a user_id, username, or just an auth mash with a username and id.
    case user
    when Fixnum
      User.new(YvApi.get("users/view", user_id: user, auth: auth).to_hash)
    when Hashie::Mash
      User.new(YvApi.get("users/view", user_id: user.id, auth: auth).to_hash)
    when String
      # User.new(YvApi.get("users/view", user_id: ### Need an API method here ###, auth: auth))
    end
  end

  # Contains defaults for when a new user is being created
  def initialize(params = {})
    params[:agree] = true if params[:agree]
    reg_data = {id: nil, email: "", username: "", password: "", verified: false, agree: false}.merge!(params)
    reg_data[:id] = reg_data[:id].to_i # If it came back from the API
    reg_data.each do |k,v|
      self.instance_variable_set("@#{k}", v) # Create instance variable
      self.class.send(:define_method, k, proc{self.instance_variable_get("@#{k}")}) # Create the getter
      self.class.send(:define_method, "#{k}=", proc{|v| self.instance_variable_set("@#{k}", v)}) # Create the setter
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
    Note.for_user(id, auth)
  end
  
  def notes(auth)
    self.class.User.notes(id, auth)
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
end
