require 'digest/md5'

class User < YV::Resource

  include YV::Concerns::Searchable

  api_response_mapper YV::API::Mapper::User

  attributes([ :id,
               :name,
               :username,
               :first_name,
               :last_name,
               :password,
               :password_confirmation,
               :email,
               :agree,
               :email_opt_in,
               :verified,
               :location,
               :im_type,
               :im_username,
               :phone_mobile,
               :language_tag,
               :country,
               :timezone,
               :postal_code,
               :bio,
               :birthdate,
               :gender,
               :website,
               :twitter,
               :facebook,
               :apps,
               :google,
               :created_dt,
               :last_login_dt,
               :start_dt,
               :avatars])


  class << self

    # Registration method, takes a hash of params to pass to API
    # returns a YV::API::Result decorator for a User instance if create succeeds
    # returns a YV::API::Result with errors if create fails
    def register(opts = {})
      opts = {
        verified: false,
        agree: false
      }.merge!(opts.symbolize_keys)

      opts[:agree] = true if opts[:agree]

      if opts[:tp_id]
        opts[:token] = Digest::MD5.hexdigest ".Yv6-#{opts[:tp_id]}"
      else
        opts[:token] = Digest::MD5.hexdigest "#{opts[:email]}.Yv6-#{opts[:password]}"
      end

      opts[:notification_settings] = { newsletter: {email: true}}

      # timezone is passed in through form in opts
      data, errs = post("users/create", opts)
      results = if errs.blank?
         YV::API::Results.new(new(data),errs) # data = User
      else
         YV::API::Results.new(data,errs)      # data = Hash API response
      end

      return results
    end

    # API Method
    # Authenticate a user with (username, password)
    # returns a YV::API::Result decorator for a User instance if user is properly authenticated
    # returns a YV::API::Result with errors if authentication is invalid
    def authenticate(username, password, tp_token = nil)
      if !tp_token.nil?
        auth = { tp_token: tp_token }
      else
        auth = {username: username, password: password}
      end

      id_results = find_id(username)
      if id_results.valid?

        # We never want a user to authenticate with a cached user object
        #  so delete the matched user from cache before authenticating
        user_cache_key = YV::Caching::cache_key("users/view", {query: {id: id_results.user_id}})
        Rails.cache.delete(user_cache_key)

        return find(id_results.user_id, auth: auth.merge(user_id: id_results.user_id))
      else
        return id_results
      end
    end


    # Lookup a system id for a user by username or email address
    # Returns YV::API::Results with custom data or errors
    # custom data: {"user_id"=>7541650}
    def find_id( username_or_email )
      opts_key = (username_or_email.include? '@') ? :email : :username
      lookup_opts = {opts_key => username_or_email}
      data, errs = get("users/user_id", lookup_opts)
      return YV::API::Results.new(data,errs)  # data --> {"user_id"=>7541650}
    end

    # Find a user by name
    # Returns YV::API::Results decorator for User instance
    def find_by_username( name , opts = {})
      if name.match(/^[0-9]+$/) # Numeric string user id
        user_id = name.to_i
      else                      # email or username
        results = find_id(name)
        return results unless results.valid? #if results are invalid, return this as the response

        user_id = results.user_id.to_i
      end

      return find_by_id(user_id,opts)
    end

    # Find a user by their system id
    # Returns YV::API::Results decorator for User instance
    def find_by_id( id , opts = {})
      data, errs = get("users/view", opts.merge(id: id))

      # Don't cache an invalid user
      if not errs.blank?
        user_cache_key = YV::Caching::cache_key("users/view", {query: {id: id}})
        Rails.cache.delete(user_cache_key)
      end

      return YV::API::Results.new(new(data.merge!(auth: opts[:auth])), errs)
    end

    def find_by_auth(opts = {})
      opts.delete :cache_for
      data, errs = get("users/view", opts)
      return YV::API::Results.new(new(data.merge!(auth: opts[:auth])), errs)
    end

    # Find a user by id, username or email address
    # Returns YV::API::Results decorator for User instance
    def find(username_or_id, opts = {})
      opts[:cache_for] = YV::Caching.a_short_time
      case username_or_id
        when String
          return find_by_username( username_or_id , opts )
        when Fixnum
          return find_by_id(username_or_id, opts )
        else
          return find_by_auth(opts)
      end
    end

    # Destroy user
    # Returns YV::API::Results with custom data or errors
    def destroy(auth)
      if auth[:tp_id]
        token = Digest::MD5.hexdigest ".Yv6-#{auth[:tp_id]}"
      else
        token = Digest::MD5.hexdigest "#{auth[:username]}.Yv6-#{auth[:password]}"
      end
      data, errs = post(delete_path, auth: auth, token: token)
      return YV::API::Results.new(data,errs)
    end

    # Confirm an email change from a given API token
    # Returns YV::API::Results decorator for a User instance or errors
    def confirm_update_email(token)
      data, errs = post("users/confirm_update_email", token: token)
      result = (errs.blank?) ? new(data) : data #if no errors, create User instance w/ data, otherwise just data.
      return YV::API::Results.new(result,errs)
    end

    # Submit email to retrieve a new password if forgotten
    # returns YV::API::Results instance for api data or errors
    def forgot_password(email)
      data, errs = post("users/forgot_password", email: email)
      return YV::API::Results.new(data,errs)
    end

    def view_settings(auth)
      data, errs = get("users/view_settings", auth: auth)
      return YV::API::Results.new(data,errs)
    end

    def update_settings(auth, settings)
      data, errs = post("users/update_settings", auth: auth, settings: settings)
      return YV::API::Results.new(data,errs)
    end

  end
  # END Class methods ------------------------------------------------------





  def initialize(data = {})
    super(
      data.merge(
        notification_settings:{ newsletter:{ email: true }},
        secure: true,
        agree:  true
      )
    )
  end


  def vod_subscription
    @vod_subscription ||= VodSubscription.all(auth: self.auth)
  end


  def profile_incomplete?
    first_name.blank? or
    last_name.blank? or
    location.blank? or
    bio.blank?
  end

  # instance method for updating email address
  def update_email(email)
    data, errs = self.class.post("users/update_email", email: email, auth: self.auth)
    return YV::API::Results.new(data,errs)
  end

  # Instance method to update password
  def update_password(opts)
    opts[:auth] = self.auth
    data, errs = self.class.post("users/update_password", opts)
    return YV::API::Results.new(data,errs)
  end

  # Instance method
  # Updates profile picture
  def update_picture(uploaded_file)
    error = {}
    if uploaded_file.nil?
      error["key"]   = "picture_empty"
      error["error"] = I18n.t("users.profile.picture_empty")
    elsif uploaded_file.size > 1.megabyte
      error["key"]   = "picture_too_large"
      error["error"] = I18n.t("users.profile.picture_too_large")
    end

    unless error.has_key?("error")
      begin
        image = Base64.strict_encode64(File.read(uploaded_file.path))
        data, errs = self.class.post("users/update_avatar", image: image, auth: self.auth, timeout: 15)
        return YV::API::Results.new(data,errs)
      rescue APITimeoutError
        error["key"]   = "transfer_too_slow"
        error["error"] = I18n.t("users.profile.transfer_too_slow")
      end
    end

    return YV::API::Results.new(nil, [YV::API::Error.new(error)])
  end


  def before_update
    self.attributes.delete "im_type"
    self.attributes.delete "im_username"
  end



  def destroy
    return false unless auth_present?

    response = true
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

  def to_param
    self.username
  end

  def to_path
    "/users/#{to_param}"
  end


  def share(opts = {})
    # validate that a connection was specified.  TODO: populate errors object + I18n
    return false unless opts[:connections]
    opts[:connections] = opts[:connections].keys.join("+") if opts[:connections].is_a? Hash
    opts.merge!({auth: self.auth}) if opts[:auth].blank?
    if opts[:connections].match(/twitter/)
      tw_data,tw_errs = self.class.post("share/send_twitter", opts)
      tw_results = YV::API::Results.new(tw_data,tw_errs)
      if tw_results.invalid?
         if defined? tw_results.errors[:base]
          self.errors = tw_results.errors[:base]
        else
          self.errors = tw_results.errors
        end
      end
    end

    opts.merge!({auth: self.auth}) if opts[:auth].blank?
    if opts[:connections].match(/facebook/)
      fb_data,fb_errs = self.class.post("share/send_facebook", opts)
      fb_results = YV::API::Results.new(fb_data,fb_errs)
      if fb_results.invalid?
        if defined? tw_results.errors
          self.errors = tw_results.errors[:base] | fb_results.errors[:base]
        elsif defined? fb_results.errors[:base]
          self.errors = fb_results.errors[:base]
        else
          self.errors = fb_results.errors
        end
      end
    end

    return self
  end

  def notes(opts = {})
    Note.for_user(self.id, opts.merge({auth: self.auth}))
  end

  def badges
    results = Badge.all(user_id: self.id)
    results.data if results.valid?
  end


  def bookmarks(opts = {})
    Bookmark.for_user(self.id, opts)
  end

  def notifications_token
    NotificationSettings.find(auth: auth).token
  end

  def find_badge(slug, opts = {})
    unless badge = self.badges.detect { |b| b.slug == slug }
      raise YouVersion::API::RecordNotFound
    end
    return badge
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

  def devices
    Device.for_user(self.auth.user_id, auth: self.auth)
  end


  def connections
    @connections ||= {
      "twitter" => build_connection(:twitter),
      "facebook" => build_connection(:facebook)
    }
  end

  def subscriptions(opts = {})
    subs = Subscription.all(user_id: id, auth: auth)
    subs.each {|s| s.user = self } #populate each subscription with user object to avoid api lookups
  end

  def subscription(plan)
    Subscription.find(plan, id, auth: auth)
  end

  def subscribed_to? (plan, opts = {})
    #if auth is nil, it will attempt to search for public subscription
    return Subscription.find(plan, auth: auth).present? rescue false
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


  # Determine if this user is friends with another user given their user id.
  # Params:
  # - id: required (id of User)
  # returns: boolean

  def friends_with?(id)
    friend_ids.include? id.to_i
  end


  # Returns a boolean if this user can interact with a moment. (comment, like, view comments and likes)
  def interact_with?(moment)
    user_id = moment.user.id
    id == user_id or friends_with?(user_id)
  end


  # A User is only allowed to access friendship features if they have both a first &
  # last name set
  # returns: boolean
  def enable_friendships?
      return (first_name.present? and last_name.present?)
  end

  def ensure_language_tag
    language_tag == "false" ? "en" : language_tag
  end

  private

  def build_connection(type)
    raise "Type argument must be :twitter or :facebook" unless [:twitter,:facebook].include? type
    klass = "#{type.to_s.capitalize}Connection".constantize
    klass.new(data: self.apps.send(type).symbolize_keys, auth: self.auth.symbolize_keys) if self.apps.send(type)
  end

  def friend_ids
    @friend_ids ||= Friend.ids(auth: self.auth)
  end

end
