require 'digest/md5'

class User < YV::Resource

  api_response_mapper YV::API::Mapper::Base  

  attribute :id
  attribute :name
  attribute :username
  attribute :first_name
  attribute :last_name

  attribute :password
  attribute :password_confirm
  attribute :email
  attribute :agree
  attribute :verified
  
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

  attribute :avatars



  class << self

    # Registration method, takes a hash of params to pass to API
    # returns a YV::API::Result decorator for a User instance if create succeeds
    # returns a YV::API::Result with errors if create fails
    def register(opts = {})
      opts = {
        email: "",
        first_name: "",
        last_name: "",
        username: "",
        password: "",
        verified: true,
        agree: false
      }.merge!(opts.symbolize_keys)

      opts[:agree] = true if opts[:agree]
      opts[:token] = Digest::MD5.hexdigest "#{opts[:username]}.Yv6-#{opts[:password]}"
      opts[:notification_settings] = { newsletter: {email: true}}

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
    def authenticate(username, password)
      auth = {username: username, password: password}

      # First make sure we have a user
      initial_results = find_by_username(username)
      return initial_results unless initial_results.valid?  #return here with invalid results if we didn't find a user

      data, errs = post("users/authenticate", auth: auth  ) # Data returned: {"id"=>7541650, "username"=>"BrittTheIsh"}
      results = YV::API::Results.new( data , errs ) 
      
      if results.valid?
         # we've successfully authenticated
         # we now need to make another API view call with auth info to retrieve entire detailed user info.
         results = find(data.id, auth: auth.merge(user_id: data.id)) # our user     
      end

      return results
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
      return YV::API::Results.new(new(data.merge!(auth: opts[:auth])), errs)
    end

    # Find a user by id, username or email address
    # Returns YV::API::Results decorator for User instance
    def find(username_or_id, opts = {})
      case username_or_id
        when String
          return find_by_username( username_or_id , opts )
        when Fixnum
          return find_by_id(username_or_id, opts )
      end
    end

    # Destroy user
    # Returns YV::API::Results with custom data or errors
    def destroy(auth)
      data, errs = post(delete_path, auth: auth)
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


  end






  def initialize(data = {})
    super(
      data.merge(
        notification_settings:{ newsletter:{ email: true }},
        secure: true,
        agree:  true
      )
    )
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
  # TODO: localize for error key: users.image_decoded.not_valid_image
  def update_picture(uploaded_file)
    error = {}
    if uploaded_file.nil?
      error["key"]   = "picture_empty"
      error["error"] = "Please select a picture to upload"
    elsif uploaded_file.size > 1.megabyte
      error["key"]   = "picture_too_large"
      error["error"] = "Picture should be less than 1 megabyte"
    end    

    unless error.has_key?("error")
      begin
        image = Base64.strict_encode64(File.read(uploaded_file.path))
        data, errs = self.class.post("users/update_avatar", image: image, auth: self.auth, timeout: 15)
        return YV::API::Results.new(data,errs)
      rescue APITimeoutError
        error["key"]   = "transfer_too_slow"
        error["error"] = "Choose a smaller picture or find a faster connection"
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

  def direct_user_avatar_url
    # some calls returning user info don't have avatar URLS
    # we need the direct path to avoid CDN cache in certain cases
    attributes["direct_user_avatar_url"] ||= self.generate_user_avatar_urls(direct: true)
  end

  def to_param
    self.username
  end


  def share(opts = {})
    # validate that a connection was specified.  TODO: populate errors object + I18n
    return false unless opts[:connections]
    successful = true

    opts[:connections] = opts[:connections].keys.join("+")
    data,errs = self.class.post("users/share", opts.merge({auth: self.auth}))
    results = YV::API::Results.new(data,errs)
    if results.invalid?
       self.errors = results.errors
       successful = false
    end
    return successful
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



  # API Method
  # Returns an array of objects / model instances of a users recent activity

  def recent_activity
    unless @recent_activity

      data, errs = self.class.get("community/items", user_id: self.id)
      results = YV::API::Results.new(data,errs)

      if results.invalid?
        (results.has_error?("not found") || results.has_error?("deprecated"))  ? @recent_activity = [] : self.class.raise_errors(results.errors, "user#recent_activity")
      end

      if results.valid?
        activities = data.community.map do |a|
          a.type = "object" if a.type == "reading_plan_completed"
          a.type = "object" if a.type == "reading_plan_subscription"
          if a.type != "like" && a.type != "object"
            class_name = a.type.camelize.constantize
            a.data.map { |b| class_name.new(b) }
          end
        end
        @recent_activity = activities.flatten
      end
    end
    return @recent_activity
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

  def subscriptions(opts = {})
    subs = Subscription.all(user_id: id, auth: auth)
    subs.each {|s| s.user = self } #populate each subscription with user object to avoid api lookups
  end

  def subscription(plan)
    Subscription.find(plan, id, auth: auth)
  end

  def subscribed_to? (plan, opts = {})
    #if auth is nil, it will attempt to search for public subscription
    return Subscription.find(plan, id, auth: auth).present? rescue false
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
