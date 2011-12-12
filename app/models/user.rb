require 'digest/md5'

class User < YouVersion::Resource
  # include Model
  attr_accessor :errors

  attribute :first_name
  attribute :last_name
  attribute :id
  attribute :username
  attribute :user_avatar_url
  attribute :location
  attribute :email
  attribute :gender
  attribute :website
  has_many_remote :badges

  def name
    "#{first_name} #{last_name}"
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
  def register(opts = {})
    opts = {email: "", username: "", password: "", verified: false, agree: false}.merge!(opts)
    opts[:token] = Digest::MD5.hexdigest "#{opts[:username]}.Yv6-#{opts[:password]}"
    opts[:agree] = true if opts[:agree]
    opts[:secure] = true
    opts["notification_settings[newsletter][email]"] = true
    errors = nil
    response = YvApi.post('users/create', opts) do |ee|
      errors = ee
    end    
    return errors || true
  end

  def authenticate(username, password)
    hash = {}
    response = YvApi.get('users/authenticate', auth_username: username, auth_password: password) { return nil }.to_hash
    if response
      response["auth"] = Hashie::Mash.new(user_id: response[:id], username: response[:username], password: password)
      new(response)
    end
  end

  def id_key_for_version
    case Cfg.api_version
    when "2.3"
      :user_id
    when "2.4"
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
        hash = YvApi.get("users/view", id_key_for_version => user, :auth => opts[:auth]).to_hash
      else
        hash = YvApi.get("users/view", id_key_for_version => user).to_hash
      end
      hash[:auth] = opts[:auth] ||= nil
    when Hashie::Mash
      hash = YvApi.get("users/view", id: user.user_id, auth: user).to_hash
      hash[:auth] = user
    when String
      case user
      when /\s*\d+\s*/      # It's just a number in string form
        hash = YvApi.get("users/view", id_key_for_version => user.to_i).to_hash
        hash[:auth] = user
      # when /username-type-pattern/
      #   hash = YvApi.get find-by-username-yay
      else
        raise ArgumentError, "Strings not supported yet as value type for 'user' param in User.find"
      end
      # User.new(YvApi.get("users/view", user_id: ### Need an API method here ###, auth: auth))
    end
    usr = User.new(hash)
    usr
  end
end


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
    response = YvApi.get("community/items", user_id: self.id)
    if response.community
      activities = response.community.map do |a|
        a.type = "user" if a.type == "follow"
        a.type = "object" if a.type == "reading_plan_completed"
        a.type = "object" if a.type == "reading_plan_subscription"
        class_name = a.type.camelize.constantize
        a.data.map { |b| class_name.new(b) }
      end
      activities.flatten!
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
