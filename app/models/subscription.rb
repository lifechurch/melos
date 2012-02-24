class Subscription < Plan

  attribute :user_id
  attribute :private
  attribute :system_accountability
  attribute :group_id
  attribute :email_delivery
  attribute :email_delivery_version
  
  def user
      @user ||= User.find(auth ? auth : user_id.to_i)
  end
  
  def start
      @start ||= Date.parse(@attributes.start)
  end
  
  def end
      @end ||= Date.parse(@attributes.end)
  end
  
  def reading_date(day)
    (start + day) - 1
  end
  
  def progress
    @progress ||= @attributes.completion_percentage
  end
  
  def days
    @total_days ||= @attributes.subscription_total_days
  end
  
  def total_days
    days.to_i
  end
  
  def self.find(plan, user, opts = {})
    #if auth is nil, it will attempt to search for public subscription
    case user
    when User
      opts[:user_id] = user.id
    when Fixnum, /\A[\d]+\z/                    #id (possibly in string form)
      opts[:user_id] = user.to_i
    else                                        #hope the user find can handle it
      opts[:user_id] = User.find(user).id  
    end
    
    case plan
    when Fixnum, /\A[\d]+\z/
      opts[:id] = plan.to_i
    when Plan, Subscription
      opts[:id] = plan.id.to_i
    when String
      opts[:id] = Plan.find(plan).id
    end

    _auth = opts[:auth]
    
    response = YvApi.get("reading_plans/view", opts) do |errors| #we can't use Plan.find because it gets an unexpected response from API when trying un-authed call so it never tries the authed call
      if errors.length == 1 && [/^Reading plan not found$/].detect { |r| r.match(errors.first["error"]) }
        return nil
      else
        raise YouVersion::ResourceError.new(errors)
      end
    end
    
    Subscription.new(response.merge(auth: _auth))
  end
  
  def day_statuses
    if auth
      response = YvApi.get('reading_plans/calendar', {auth: auth, id: id, user_id: user_id}) do |errors|
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
  
  def current_day
    @current_day ||= [((DateTime.now.utc + user.utc_date_offset) - start).floor + 1, total_days].min
  end
  
  def current_reading
    reading(current_day)
  end
  
  def set_ref_completion(day, ref, completed)
    #ref could be osis, index in plan day, or Reference object
    #TODO: possibly handle if day is Date object
    if auth
      opts = {auth: auth}
      opts[:id] = id
      opts[:day] = day
      
      case ref
      when Fixnum, /\A[\d]+\z/                    #number (possibly in string form) - assume index of reference in the day
        ref = reading(day).references[ref.to_i].ref   
      when Reference                              #Good to go
      when String                                 #try to create Ref, assuming osis string
        begin
          ref = Reference.new(ref)
          rescue
           raise "incorrect string format for reference"
        end
      else
        raise "incorrect string format for reference"
      end
      
      #Get the list of completed references to send back to the API (all others will be marked as not-complete)
      completed_refs = ReferenceList.new
      reading(day).references.each {|r_mash| completed_refs << r_mash.ref if r_mash.completed?}
        #adjust the ref_list based on the new completion state for the ref
      completed ? completed_refs << ref : completed_refs.delete(ref)
      completed_refs.uniq! #just to be safe
      
      opts[:references] = completed_refs.to_api_string
      
      YouVersion::Resource.post('reading_plans/update_completion', opts) do |errors|
          raise YouVersion::ResourceError.new(errors)
      end
      #TODO: update object to reflect state change
    else
      raise "Authentication required to update plan progress"
    end
  end
  
  def catch_up
    if auth
      response = YouVersion::Resource.post('reading_plans/reset_subscription', {auth: auth, id: id}) do |errors|
          raise YouVersion::ResourceError.new(errors)
      end
      @attributes.merge!(response)
    else
      raise "Authentication required to catch up on a plan"
    end  
  end
  
  def restart
    if auth
      response = YouVersion::Resource.post('reading_plans/restart_subscription_user', {auth: auth, id: id}) do |errors|
          raise YouVersion::ResourceError.new(errors)
      end
      @attributes.merge!(response)
    else
      raise "Authentication required to restart a reading plan"
    end
  end
  
  def self.delete_path
    "#{api_path_prefix}/unsubscribe_user"
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
  
  def email_delivery?
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
  
  def enable_email_delivery(opts = {})
    params = {}
    params[:email_delivery_version] = opts[:picked_version] || version || opts[:default_version]
    params[:email_delivery] = delivery_time(opts[:time])
    
    update_subscription(params)
  end
  
  def disable_email_delivery
    update_subscription(email_delivery: "disabled")
  end
  
  def reminder_enabled?
    system_accountability
  end
  
  def accountability_partners
    update_accountability_partners if @partners.nil?  #cached so we allow iteration on this array
    
    @partners
  end
  
  def remove_all_accountability
    update_accountability_partners if @partners.nil?
    @partners.each{|p| remove_accountability_user(p.id)}
  end
  
  def add_accountability_user(user)
    update_accountability(user, action: "add")
  end
  
  def remove_accountability_user(user)
    update_accountability(user, action: "delete")
  end
  
  def enable_reminder
    #TODO: do through bool assignment of property
    update_subscription(system_accountability: true)
  end
  
  def disable_reminder
    #TODO: do through bool assignment of property
    update_subscription(system_accountability: false)
  end
  
  def to_param
    "#{id}-#{slug}"
    #TODO: delete function? should just use parent's?
  end
  
  def reading(day, opts = {})
    super(day, opts.merge!({auth: auth, user_id: user_id}))
  end
  
  private
  
  def update_accountability_partners
    if auth
      opts = {auth: auth}
      opts[:page] = 1 #We only support 25 users (max in use is 19) until more are needed (then we can just get them all below)
      opts[:id] = id
      opts[:user_id] = user_id
      
      response = YvApi.get("reading_plans/accountability", opts) do |errors|
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
      opts[:start] = start.iso8601
      opts[:total_days] = total_days
      opts[:group_id] = group_id
      opts[:private] = private if opts[:private].nil?
      opts[:system_accountability] = system_accountability if opts[:system_accountability].nil?
      opts[:email_delivery] ||= email_delivery
      opts[:email_delivery_version] ||= email_delivery_version
      
      if opts[:email_delivery] == "disabled"
        opts[:email_delivery] = opts[:email_delivery_version] = nil
      end
      
      # Note: Not a partial update, if I don't pass these items, they will be overwritten by defaults.
      # id  of reading plan
      # start date to start reading plan on
      # end date to end reading plan on (required if total_days isn't sent, most send total_days)
      # total_days  of reading plan subscription length, normally you just use the value supplied in the view method
      # group_id  of group that the user subscribed as a result of, so if a group starts a reading plan and a user subscribes off that group, we track the group id here so that we have record of it
      # private true/false on whether the subscription should be private
      # system_accountability true/false on whether you want the system to send you weekly reminders about your progress, can be turned off at a later time
      # email_delivery  00:00:00 FORMAT for time to deliver email - best if random to spread load
      # email_delivery_version  OSIS format string for version to deliver. Send default if there is one for plan, else use user's version
      response = YouVersion::Resource.post('reading_plans/update_subscribe_user', opts) do |errors|
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

      response = YouVersion::Resource.post("reading_plans/#{mode}_accountability", opts) do |errors|
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