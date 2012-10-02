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
  attribute :apps
  attribute :google
  attribute :created_dt
  attribute :last_login_dt
  attribute :start_dt

  validate :valid_picture_size?, if: "uploaded_file?"

  has_many_remote :badges

  def self.update_path
    "users/update"
  end

  def self.create_path
    "users/create"
  end

  def name
    return nil unless first_name && last_name
    "#{first_name} #{last_name}"
  end

  def zip_code
    postal_code
  end

  def zip
    zip_code
  end

  def user_avatar_url
    # some calls returning user info don't have avatar URLS
    attributes["user_avatar_url"] ||= self.generate_user_avatar_urls
  end

  def direct_user_avatar_url
    # some calls returning user info don't have avatar URLS
    # we need the direct path to avoid CDN cache in certain cases
    attributes["direct_user_avatar_url"] ||= self.generate_user_avatar_urls(direct: true)
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
      when "3.0"
        :id
      else
        :user_id
      end
    end

    def authenticate(username, password)
      # hash = {}
      # response = YvApi.post('users/authenticate', auth: Hashie::Mash.new(username: username, password: password)) { return nil }.to_hash
      # if response
      #   response = response.symbolize_keys
      #   response[:auth] = Hashie::Mash.new(user_id: response[:id].to_i, username: response[:username], password: password)
      #   new(response)
  # end
      id_opts = {}
      id_response = YvApi.post("users/authenticate", auth: {username: username, password: password})
      auth = Hashie::Mash.new(username: username, password: password, user_id: id_response.id)
      response = YvApi.get("users/view", id_key_for_version => id_response.id, auth: auth)
      response[:auth] = auth
      User.new(response)
    end

    def find(user, opts = {})
        # Pass in a user_id, username, or just an auth mash with a username and id.
        case user
        when Fixnum
          if opts[:auth] && user == opts[:auth].user_id
            response = YvApi.get("users/view", id_key_for_version => user, auth: opts[:auth])
          else
            response = YvApi.get("users/view", id_key_for_version => user)
          end
          response[:auth] = opts[:auth] ||= nil
        when Hashie::Mash
          response = YvApi.get("users/view", id: user.user_id, auth: user)
          response[:auth] = user
        when String
          if user.match(/^[0-9]+$/)
            if opts[:auth] && user == opts[:auth].user_id
              response = YvApi.get("users/view", id_key_for_version => user, auth: opts[:auth])
            else
              response = YvApi.get("users/view", id_key_for_version => user)
            end
          else
            id_opts = {}
            # 10-2 Josh would prefer to not fix broken behavior, hope we don't hit it.
            raise APIError, "API can't handle email addresses" if user.include? '@'
            id_response = YvApi.get("users/user_id", username: user)
            if opts[:auth] && user == opts[:auth].username
              response = YvApi.get("users/view", id_key_for_version => id_response.user_id, auth: opts[:auth])
            else
              response = YvApi.get("users/view", id_key_for_version => id_response.user_id)
            end
            response[:auth] = opts[:auth] ||= nil
          end
        end
      User.new(response)
    end

    def destroy(auth, &block)
      response = post(delete_path, {token: persist_token(auth.username, auth.password), auth: auth}, &block)
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
    self.class.confirm(hash)
  end

  def update_email(email)
    response = YvApi.post("users/update_email", email: email, auth: self.auth) do |errors|
      new_errors = errors.map { |e| e["error"] }
      self.errors[:base] << new_errors
      false
    end
  end

  def confirm_update_email(token)
    response = YvApi.post("users/confirm_update_email", token: token) do |errors|
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

  def self.confirm(hash)
    user = nil

    response = YvApi.post("users/confirm", token: hash) do |errors|
      user = User.new

      if i = errors.find_index{|e| e["key"] == "users.hash.verified"}
        user.errors.add :already_confirmed, errors.delete_at(i)["error"]
      end

      if i = errors.find_index{|e| e["key"] == "users.hash.invalid"}
        user.errors.add :invalid_hash, errors.delete_at(i)["error"]
      end

      errors.each { |e| user.errors.add :base, e["error"] }
      true #avoid accidentally raising error
    end

    user || User.new(response)
  end

  def before_update
    self.attributes.delete "im_type"
    self.attributes.delete "im_username"
  end

  def update_password(opts)
    opts[:auth] = self.auth
    result = YvApi.post("users/update_password", opts) do |errors|
      errors.each { |e| self.errors.add e }
      false
    end
  end

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
  #   response = YvApi.get('users/view', {user_id: id, auth_user_id: :id} ) do |errors|
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
    opts[:connections] = opts[:connections].keys.join("+")
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
    unless uploaded_file
      self.errors.add :picture_empty, "Please select a picture to upload"
      return false
    end

    if uploaded_file.size > 1.megabyte
      self.errors.add :picture_too_large, "Picture should be less than 1 megabyte"
      return false
    end

    image = Base64.strict_encode64(File.read(uploaded_file.path))
    begin
      response = self.class.post("users/update_avatar", image: image, auth: self.auth, timeout: 12) do |errors|
        if i = errors.find_index{ |e| e["key"] == "users.image_decoded.not_valid_image" }
          self.errors.add :picture_invalid_type, errors.delete_at(i)["error"]
        end

        errors.each { |e| self.errors.add :base, e["error"] }
        return false
      end
    rescue APITimeoutError
      self.errors.add :transfer_too_slow, "Choose a smaller picture or find a faster connection"
      return false
    end
    true
  end

  def valid_picture_size?
  end

  def devices
    Device.for_user(self.auth.user_id, auth: self.auth)
  end

  def connections
    connections = {}
    connections["twitter"] = TwitterConnection.new(data: self.apps.twitter.symbolize_keys, auth: self.auth.symbolize_keys) if self.apps.twitter
    connections["facebook"] = FacebookConnection.new(data: self.apps.facebook.symbolize_keys, auth: self.auth.symbolize_keys) if self.apps.facebook
    connections
  end

  def follow(opts = {})
    opts = {id: self.id, auth: self.auth}.merge(opts)
    response = YvApi.post("users/follow", opts) do |errors|
      if errors.length == 1 && [/^You are already following this user$/].detect { |r| r.match(errors.first["error"]) }
        return true #if user tried to follow and already did, no worries, operation successful
      else
        raise YouVersion::ResourceError.new(errors)
      end
    end

    return true
  end


  def unfollow(opts = {})
    opts = {id: self.id, auth: self.auth}.merge(opts)
    response = YvApi.post("users/unfollow", opts) do |errors|
      if errors.length == 1 && [/^You are not following this user$/].detect { |r| r.match(errors.first["error"]) }
        return true #if user tried to unfollow and wasn't following, no worries, operation successful
      else
        raise YouVersion::ResourceError.new(errors)
      end
    end
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
      response.following.each { |u| followings << User.new(u) }
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
    end.following
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
      response.followers.each { |u| fl << User.new(u) }
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
    end.followers
  end

  def subscriptions(opts = {})
    Subscription.all(user_id: id, auth: auth)
  end

  def subscription(plan)
    Subscription.find(plan, id, auth: auth)
  end

  def subscribed_to? (plan, opts = {})
    #if auth is nil, it will attempt to search for public subscription
    return Subscription.find(plan, id, auth: auth).present? rescue false
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
    opts = opts.merge({cache_for: a_very_long_time}) if opts[:auth] == nil
    response = YvApi.get("highlights/configuration", opts) do |errors|
      raise YouVersion::ResourceError.new(errors)
    end
    response[:highlight_colors] = response.delete(:colors)
    response
  end

  def ==(compare)
    compare.class == self.class && self.id == compare.id
  end


  def utc_date_offset
    timezone ? ActiveSupport::TimeZone[timezone].utc_offset/86400.0 : 0.0
  end

  def generate_user_avatar_urls(opts = {})
    sizes = ["24x24", "48x48", "128x128", "512x512"]
    avatar_path = opts[:direct] ? "avatar_path_direct" : "avatar_path"

    mash = Hashie::Mash.new()
    sizes.each do |s|
      mash["px_#{s}"] = Cfg.send(avatar_path) + Digest::MD5.hexdigest(self.username.to_s) + "_" + s + ".png"
    end
    mash
  end

end
