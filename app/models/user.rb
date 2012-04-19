require 'digest/md5'

class User < YouVersion::Resource
  # include Model

  attribute :id
  attribute :username
  attribute :password
  attribute :password_confirm
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

  api_version "2.5"

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

  def user_avatar_url
    attributes["user_avatar_url"] ||= self.generate_user_avatar_urls
  end

  def to_param
    self.username
  end

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

    def authenticate(username, password)
      hash = {}
      response = YvApi.get('users/authenticate', auth_username: username, auth_password: password) { return nil }.to_hash
      pp response
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
        else
          :user_id
        end
    end

    def find(user, opts = {})
        # Pass in a user_id, username, or just an auth mash with a username and id.
        case user
        when Fixnum
          if opts[:auth] && user == opts[:auth].user_id
            response = YvApi.get("users/view", id_key_for_version => user, :auth => opts[:auth])
          else
            response = YvApi.get("users/view", id_key_for_version => user)
          end
          response[:auth] = opts[:auth] ||= nil
        when Hashie::Mash
          response = YvApi.get("users/view", id: user.user_id, auth: user)
          response[:auth] = user
        when String
          id_response = YvApi.get("users/user_id", api_version: "2.5", username: user)
          if opts[:auth] && user == opts[:auth].username
            response = YvApi.get("users/view", id_key_for_version => id_response.user_id, :auth => opts[:auth])
          else
            response = YvApi.get("users/view", id_key_for_version => id_response.user_id)
          end
          response[:auth] = opts[:auth] ||= nil
        end
      User.new(response)
    end
    
    def destroy(auth, &block)
      post(delete_path, {token: persist_token(auth.username, auth.password), auth: auth, api_version: "2.5"}, &block)
    end
    
  end

  def initialize(data = {})
    data["agree"] = (data["agree"] == "1") unless data.blank?
    @attributes = data
    @associations = {}

    after_build
  end

  def persist_token
    self.class.persist_token(self.username, self.password)
  end
  
  def before_save
    # opts = {"email" => "", "username" =>  "", "password" =>  "", "verified" => false, "agree" => false}.merge!(opts)
    # opts["token"] = Digest::MD5.hexdigest "#{self.username}.Yv6-#{self.password}"
    # opts["agree"] = true if opts["agree"]
    # opts[:secure] = true
    self.attributes[:secure] = true
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

  def update_email(email)
    response = YvApi.post("users/update_profile", email: email, api_version: "2.3", auth: self.auth) do |errors|
      new_errors = errors.map { |e| e["error"] }
      self.errors[:base] << new_errors
      false
    end
  end

  def confirm_update_email(token)
    response = YvApi.post("users/update_email", encrypt: token) do |errors|
      new_errors = errors.map { |e| e["error"] }
      self.errors[:base] << new_errors
      false
    end
  end

  def self.forgot_password(email)
    YvApi.post("users/forgot_password", email: email) do |errors|
      return false
    end
  end

  def self.resend_confirmation(email)
    YvApi.post("users/resend_confirmation", email: email) do |errors|
      return false
    end
  end

  def before_update; end

  def destroy
    response = true

    return false unless authorized?

    before_destroy

    begin
      response = self.class.destroy(self.auth) do |errors|
        new_errors = errors.map { |e| e["error"] }
        self.errors[:base] << new_errors

        if block_given?
          yield errors
        end

        response = false
      end
    ensure
      after_destroy
    end
    response
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
  def share(opts = {})
    puts "in"
    opts[:connections] = opts[:connections].keys.join("+")
    puts opts
    result = YvApi.post("users/share", opts.merge({auth: self.auth})) do |errors|
      new_errors = errors.map { |e| e["error"] }
      self.errors[:base] << new_errors
      false
    end
  end
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

  def notifications_token
    NotificationSettings.find(auth: auth).token
  end

  def likes(opts={})
    Like.for_user(id, opts)
  end

  def find_badge(slug, opts = {})
    self.badges.detect { |b| b.slug == slug }
  end

  def website_url
    if website.match(/^http/)
      website
    else
      "http://" << website
    end
  end
  
  def website_human
    if match = website.match(/(^www\.|^https?:\/\/www.|^https?:\/\/)(.*)/)
      match[2]
    else
      website
    end
  end

  def recent_activity
    unless @recent_activity
      response = YvApi.get("community/items", user_id: self.id) do |errors|
        if errors.length == 1 && [/^No(.*)found$/, /^(.*)s not found$/].detect { |r| r.match(errors.first["error"]) }
          []
        end
      end
        
      unless response.empty?
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
    return @recent_activity || []
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
    connections = {}
    connections["twitter"] = TwitterConnection.new(data: self.twitter.symbolize_keys, auth: self.auth.symbolize_keys) if self.twitter
    connections["facebook"] = FacebookConnection.new(data: self.facebook.symbolize_keys, auth: self.auth.symbolize_keys) if self.facebook
    connections
  end

  def follow(opts = {})
    opts = {id: self.id, auth: self.auth}.merge(opts)
    response = YvApi.post("users/follow", opts)
    return true
  end


  def unfollow(opts = {})
    opts = {id: self.id, auth: self.auth}.merge(opts)
    response = YvApi.post("users/unfollow", opts)
    return true
  end

  def following(opts = {})
    opts[:page] ||= 1
    response = YvApi.get("users/following", opts.merge({id: self.id})) do |errors|
      if errors.length == 1 && [/^No(.*)found$/, /^(.*)s not found$/].detect { |r| r.match(errors.first["error"]) }
        return []
      else
        new_errors = errors.map { |e| e["error"] }
        self.errors[:base] << errors
        return false
      end
    end
    unless response === false
      followings = ResourceList.new
      followings.total = response.total
      response.users.each { |u| followings << User.new(u) }
      @following_id_list = followings.map { |u| u.username }
      followings
    end
  end

  def following_user_id_list
    @following_id_list ||= all_following
  end

  def all_following
    response = YvApi.get("users/all_following", id: self.id) do |errors|
      if errors.length == 1 && [/^No(.*)found$/, /^(.*)s not found$/].detect { |r| r.match(errors.first["error"]) }
        return []
      else
        raise YouVersion::ResourceError.new(errors)
      end
    end
  end
  
  def followers(opts = {})
    opts[:page] ||= 1
    response = YvApi.get("users/followers", opts.merge({id: self.id})) do |errors|
      if errors.length == 1 && [/^No(.*)found$/, /^(.*)s not found$/].detect { |r| r.match(errors.first["error"]) }
        return []
      else
        new_errors = errors.map { |e| e["error"] }
        self.errors[:base] << errors
        return false
      end
    end
    unless response === false
      fl = ResourceList.new
      fl.total = response.total
      response.users.each { |u| fl << User.new(u) }
      fl
    end
  end

  def follower_user_id_list
    @follower_id_list ||= all_followers
  end

  def all_followers
    response = YvApi.get("users/all_followers", id: self.id) do |errors|
      if errors.length == 1 && [/^No(.*)found$/, /^(.*)s not found$/].detect { |r| r.match(errors.first["error"]) }
        return []
      else
        raise YouVersion::ResourceError.new(errors)
      end
    end
  end

  def subscriptions(opts = {})
    opts[:user_id] = id
    opts[:auth] ||= auth
    response = YvApi.get("reading_plans/items", opts) do |errors|
      if errors.length == 1 && [/^No(.*)found$/, /^(.*)s not found$/].detect { |r| r.match(errors.first["error"]) }
        return []
      else
        raise YouVersion::ResourceError.new(errors)
      end
    end

    subscriptions = ResourceList.new
    subscriptions.total = response.total
    response.reading_plans.each {|plan_mash| subscriptions << Subscription.new(plan_mash.merge(:auth => auth))}
    
    subscriptions
  end
  
  def subscription(plan)
    Subscription.find(plan, id, auth: auth)
  end
  
  def subscribed_to? (plan, opts = {})
    opts[:user_id] = id
    opts[:auth] = auth #if auth is nil, it will attempt to search for public subscription
    
    case plan
    when Fixnum, /\A[\d]+\z/
      opts[:id] = plan.to_i
    when Plan, Subscription
      opts[:id] = plan.id.to_i
    end
    response = YvApi.get("reading_plans/view", opts) do |errors| #we can't use Plan.find because it gets an unexpected response from API when trying un-authed call so it never tries the authed call
      if errors.length == 1 && [/^Reading plan not found$/].detect { |r| r.match(errors.first["error"]) }
        return false
      else
        raise YouVersion::ResourceError.new(errors)
      end
    end
    
    return response.id.to_i == opts[:id]
  end
  
  def configuration
    @config_attributes ||= self.class.configuration(auth: auth, user_id: id)
  end
  
  def highlight_colors
    configuration.highlight_colors
  end

  def self.highlight_colors(opts = {})
    opts = opts.merge({user_id: opts[:auth].user_id}) if (opts[:user_id] == nil && opts[:auth])
    self.configuration(opts).highlight_colors
  end
  
  def self.configuration(opts = {})
    opts = opts.merge({cache_for: 12.hours}) if opts[:auth] == nil
    response = YvApi.get("configuration/items", opts) do |errors|
      raise YouVersion::ResourceError.new(errors)
    end
  end
  
  def ==(compare)
    compare.class == self.class && self.id == compare.id
  end


  def utc_date_offset
    timezone ? ActiveSupport::TimeZone[timezone].utc_offset/86400.0 : 0.0
  end

  def generate_user_avatar_urls
    sizes = ["24x24", "48x48", "128x128", "512x512"]
    hash = {}
    sizes.each do |s|
      hash["px_#{s}"] = Cfg.avatar_path + Digest::MD5.hexdigest(self.username) + "_" + s + ".png" 
    end
    return Hashie::Mash.new(hash)
  end

end
