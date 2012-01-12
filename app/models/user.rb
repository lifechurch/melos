require 'digest/md5'

class User < YouVersion::Resource
  # include Model
  attr_accessor :errors

  attribute :id
  attribute :username
  attribute :email
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
  attribute :birthday
  attribute :gender
  attribute :website
  attribute :subscribed #clean up this dirt by sweeping it into subscription model

  has_many_remote :badges

  def self.update_path
    "users/update_profile"
  end

  def name
    return nil unless first_name && last_name
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
        case user
        when /\s*\d+\s*/      # It's just a number in string form
          response = YvApi.get("users/view", id_key_for_version => user.to_i)
          # response[:auth] = user
          # when /username-type-pattern/
          # hash = YvApi.get find-by-username-yay
        else
          raise ArgumentError, "Strings not supported yet as value type for 'user' param in User.find"
        end
        # User.new(YvApi.get("users/view", user_id: ### Need an API method here ###, auth: auth))
      end
      User.new(response)
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
  
  def ==(compare)
    compare.class == self.class && self.id == compare.id
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
