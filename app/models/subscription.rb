class Subscription < Plan

  attribute :user_id
  attribute :private
  attribute :group_id
  attribute :email_delivery
  attribute :email_delivery_version_id


  def self.list_path
    "#{api_path_prefix}/items"
  end

  def self.delete_path
    "#{api_path_prefix}/unsubscribe_user"
  end

  def self.destroy_id_param
    :id
  end

  def self.find(plan, user, opts = {})
    # We can't use Plan.find because it gets an unexpected response from
    # API when trying un-authed call so it never tries the authed call
    #
    # if auth is nil, the API will attempt to search for public subscription
    case user
      when User
        opts[:user_id] = user.id
      when Fixnum, /\A[\d]+\z/                    #id (possibly in string form)
        opts[:user_id] = user.to_i
      else                                        #hope the user find can handle it
        opts[:user_id] = User.find(user).id
    end

    opts[:id] = id_from_param plan
    _auth = opts[:auth]

    #We can't use Plan.find because it gets an unexpected response from
    #API when trying un-authed call so it never tries the authed call
    response = YvApi.get("#{api_path_prefix}/view", opts) do |errors|
      if errors.length == 1 && [/^Reading plan not found$/].detect { |r| r.match(errors.first["error"]) }
        return nil
      else
        raise YouVersion::ResourceError.new(errors)
      end
    end

    Subscription.new(response.merge(auth: _auth))
  end

  def self.id_from_param(param)
    case param
      when Subscription
        param.id.to_i
      else
        super
    end
  end

  def set_ref_completion(day, ref, completed)
    #TODO: possibly handle if day is Date object
    if auth
      opts = {auth: auth}
      opts[:id] = id
      opts[:day] = day
      #using no version ref to use native #delete and #uniq methods below
      no_version_ref = Reference.new(ref, version: nil)

      # Get the list of completed references to send back to the API
      # (all others will be marked as not-complete)
      completed_refs = ReferenceList.new
      reading(day).references.each {|r_mash| completed_refs << Reference.new(r_mash.ref, version: nil) if r_mash.completed?}

      #adjust the ref_list based on the new completion state for the ref
      completed ? completed_refs << no_version_ref : completed_refs.delete(no_version_ref)
      completed_refs.uniq!

      opts[:references] = completed_refs.to_usfm
      response = YouVersion::Resource.post("#{api_path_prefix}/update_completion", opts) do |errors|
          raise YouVersion::ResourceError.new(errors)
      end

      #update object to reflect state change since we only get parital response
      process_references_response response
    else
      raise "Authentication required to update plan progress"
    end
    return true
  end

  def catch_up
    if auth
      response = YouVersion::Resource.post("#{api_path_prefix}/reset_subscription", {auth: auth, id: id}) do |errors|
          raise YouVersion::ResourceError.new(errors)
      end
      @attributes.merge!(response)
    else
      raise "Authentication required to catch up on a plan"
    end
  end

  def restart
    if auth
      response = YouVersion::Resource.post("#{api_path_prefix}/restart_subscription", {auth: auth, id: id}) do |errors|
          raise YouVersion::ResourceError.new(errors)
      end
      @attributes.merge!(response)
    else
      raise "Authentication required to restart a reading plan"
    end
  end

  def make_public
    update_subscription(private: false)
  end

  def make_private
    update_subscription(private: true)
  end

  def public?
    !(private?)
  end

  def private?
    private
  end

  def enable_email_delivery(opts={})
    #TODO: make required opts params and/or handle nils, this is too opaque
    params = {}
    params[:email_delivery_version_id] = opts[:picked_version] || version_id || opts[:default_version]
    params[:email_delivery] = delivery_time(opts[:time])

    update_subscription(params)
  end

  def delivered_by_email?
    !email_delivery.nil?
  end

  def email_delivery_time_range
    case email_delivery[0..2].to_i
    when 4..7
      return "morning"
    when 12..15
      return "afternoon"
    when 16..19
      return "evening"
    else
      return nil
    end
  end

  def disable_email_delivery
    update_subscription(email_delivery: nil)
  end

  def add_accountability_user(user)
    update_accountability(user, action: "add")
  end

  def remove_accountability_user(user)
    update_accountability(user, action: "delete")
  end

  def accountability_partners
    update_accountability_partners if @partners.nil?  #cached so we allow iteration on this array

    @partners
  end

  def remove_all_accountability
    update_accountability_partners if @partners.nil?
    @partners.each{|p| remove_accountability_user(p.id)}
  end

  def delete
    unsubscribe
  end

  def unsubscribe
    if auth
      destroy
    else
      raise "Can't unsubscribe from a plan without authorization"
    end
  end

  def user
    @user ||= User.find(auth ? auth : user_id.to_i)
  end

  def progress
    @attributes.completion_percentage
  end

  def day_statuses
    if auth
      response = YvApi.get("#{api_path_prefix}/calendar", {auth: auth, id: id, user_id: user_id}) do |errors|
          raise YouVersion::ResourceError.new(errors)
      end
    else
      raise "Authentication required to view calendar of a reading plan"
    end
    response    #In this case, response is an array of mashes...
  end

  def last_completed_date
    #Returnes nil if no days have been completed
    statuses = day_statuses
    index = statuses.rindex{|day_mash| day_mash.completed}
    return nil if index.nil?

    Date.parse(statuses[index].date)
  end

  def last_completed_day
    #Returnes nil if no days have been completed
    statuses = day_statuses
    index = statuses.rindex{|day_mash| day_mash.completed}
    return nil if index.nil?

    statuses[index].day.to_i
  end

  def start
    Date.parse(@attributes.start_dt)
  end

  def end
    Date.parse(@attributes.end_dt)
  end

  def reading_date(day)
    (start + day) - 1
  end

  def days
    @attributes.total_days
  end

  def total_days
    days.to_i
  end

  def current_day
    [((DateTime.now.utc + user.utc_date_offset) - start).floor + 1, total_days].min
  end

  def current_reading
    reading(current_day)
  end

  def reading(day, opts = {})
    # Important: don't allow caching for this authed responses since completion needs to change
    super(day, opts.merge!({cache_for: 0, auth: auth, user_id: user_id}))
  end

  def day(day, opts = {})
    reading(day, opts)
  end

  private

  def update_accountability_partners
    if auth
      opts = {auth: auth}
      opts[:page] = 1 #We only support 25 users (max in use is 19) until more are needed (then we can just get them all below)
      opts[:id] = id
      opts[:user_id] = user_id

      response = YvApi.get("#{api_path_prefix}/accountability", opts) do |errors|
        if errors.length == 1 && [/^Accountability not found$/, /^API Error: Accountability not found$/].detect {|r| r.match(errors.first["error"])}
          false #returning false stops get from raising errors (will if nil returned) but still allows ternary operation below
        else
          raise YouVersion::ResourceError.new(errors)
        end
      end

      @partners = response ? response.users.map {|user_mash| Hashie::Mash.new({username: user_mash.username, id: user_mash.user_id.to_i})} : []

    else
      raise "Authentication required to view accountability for a reading plan"
    end
  end

  def update_subscription (opts = {})
    if auth
      opts[:auth] = auth
      opts[:id] = id
      opts[:private] = private if opts[:private].nil?

      if opts[:email_delivery].blank?
        opts[:email_delivery] = opts[:email_delivery_version_id] = nil
      else
        opts[:email_delivery] ||= email_delivery
        opts[:email_delivery_version_id] ||= email_delivery_version_id
      end
      # email_delivery  00:00:00 FORMAT for time to deliver email
      # best if random to spread load (re: convo with CV)

      response = YouVersion::Resource.post("#{api_path_prefix}/update_subscribe_user", opts) do |errors|
          raise YouVersion::ResourceError.new(errors)
      end
      @attributes.merge!(response)
    else
      raise "Authentication required to unsubscribe from a reading plan"
    end
  end

  def update_accountability(user, params={})
    mode = params[:action] ||= "add"

    if auth
      opts = {auth: auth}
      opts[:id] = id

      case user
      when User
        opts[:user_id] = user.id
      when Fixnum, /\A[\d]+\z/                    #id (possibly in string form)
        opts[:user_id] = user.to_i
      else                                        #hope the user find can handle it
        opts[:user_id] = User.find(user).id
      end

      raise "user id couldn't be parsed" if opts[:user_id].nil?

      response = YouVersion::Resource.post("#{api_path_prefix}/#{mode}_accountability", opts) do |errors|
          raise YouVersion::ResourceError.new(errors)
      end

      #PERF: could probably just remove from the mash and be safe if we need to save this API call
      update_accountability_partners

    else
      raise "Authentication required to add accountability to a reading plan"
    end
  end

  def delivery_time(time_range)
    case time_range
    when "morning"
      hours = (4..6)#4-6:59:59
    when "afternoon"
      hours = (12..14)#12-2:59:59
    when "evening"
      hours = (16..18)#4-6:59:59
    else
      return delivery_time("morning") #Morning seems preferred default #delivery_time(["morning","afternoon","evening"].sample)
    end

    "%02d:%02d:%02d" % [hours.to_a.sample, (0..59).to_a.sample, (0..59).to_a.sample]
  end
end