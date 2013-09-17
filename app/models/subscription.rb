class Subscription < Plan

  attribute :user_id
  attribute :private
  attribute :group_id
  attribute :email_delivery
  attribute :email_delivery_version_id

  class << self

    def list_path
      "#{api_path_prefix}/items"
    end

    def delete_path
      "#{api_path_prefix}/unsubscribe_user"
    end

    def destroy_id_param
      :id
    end

    def id_from_param(param)
      case param
        when Subscription
          param.id.to_i
        else
          super
      end
    end

    def find(plan, user, opts = {})
      # We can't use Plan.find because it gets an unexpected response from
      # API when trying un-authed call so it never tries the authed call
      #
      # if auth is nil, the API will attempt to search for public subscription

      opts[:user_id] = case user
        when User
          user.id.to_i
        when Fixnum, /\A[\d]+\z/                    #id (possibly in string form)
          user.to_i
        else                                        #hope the user find can handle it
          User.find(user).id
      end

      opts[:id] = id_from_param plan
      _auth = opts[:auth]

      #We can't use Plan.find because it gets an unexpected response from
      #API when trying un-authed call so it never tries the authed call

      data, errs = get( resource_path , opts)
      results = YV::API::Results.new(data,errs)
      unless results.valid?
        return nil if (errs.size == 1) and ([/^Reading plan not found$/].detect { |r| r.match(errs.first.error) })
        raise_errors(results.errors, "Subscription errors")
      end

      return Subscription.new(data.merge(auth: _auth), user: user) #set user on subscription to avoid api lookup
    end
  end
  # END Class method definitions --------------------------------------------------------------------------------



  def initialize( data , opts = {})
    super(data)
    @user = opts[:user] || nil # keep @user around to avoid further api calls
  end

  # Auth required

  def set_ref_completion(day, ref, completed)
    #TODO: possibly handle if day is Date object
    raise "Authentication required to update plan progress" unless auth

    opts = {auth: auth, id: id, day: day}
    #using no version ref to use native #delete and #uniq methods below
    no_version_ref = Reference.new(ref, version: nil)

    # Get the list of completed references to send back to the API
    # (all others will be marked as not-complete)
    completed_refs = ReferenceList.new
    reading(day).references.each do |r_mash| 
      completed_refs << Reference.new(r_mash.ref, version: nil) if r_mash.completed?
    end

    #adjust the ref_list based on the new completion state for the ref
    completed ? completed_refs << no_version_ref : completed_refs.delete(no_version_ref)
    completed_refs.uniq!

    opts[:references] = completed_refs.to_usfm
    
    data, errs = self.class.post("#{api_path_prefix}/update_completion", opts)
    results = YV::API::Results.new(data,errs)
    unless results.valid?
      raise_errors( results.errors, "subscription#set_ref_completion")
    end

    # API returns a 205 when plan is completed.
    # Look at YV::API::Client#post for specific implementation details.
    # return here and don't process the response as this isn't a typical response object.
    @completed = true and return if (data.code == 205 && data.completed?)

    #update object to reflect state change since we only get partial response
    process_references_response data
    return true
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

  def catch_up
    raise "Authentication required to catch up on a plan" unless auth
    data, errs = self.class.post("#{api_path_prefix}/reset_subscription", {auth: auth, id: id})
    results = YV::API::Results.new(data,errs)
      raise_errors( results.errors, "subscription#catch_up") unless results.valid?
      
    return @attributes.merge!(data)
  end
 
  def restart
    raise "Authentication required to restart a reading plan" unless auth
    data, errs = self.class.post("#{api_path_prefix}/restart_subscription", {auth: auth, id: id})
    results = YV::API::Results.new(data,errs)
      raise_errors( results.errors, "subscription#catch_up") unless results.valid?
    
    return @attributes.merge!(data)
  end

  def enable_email_delivery(opts={})
    #TODO: make required opts params and/or handle nils, this is too opaque
    params = {}
    #TODO replace this with Version object creation when lazyloading is implemented
    implicit_version = Version.id_from_param opts[:default_version]
    explicit_version = Version.id_from_param opts[:picked_version]

    params[:email_delivery_version_id] = explicit_version || version_id || implicit_version
    params[:email_delivery] = delivery_time(opts[:time])

    update_subscription(params)
  end

  def make_public
    update_subscription(private: false)
  end

  def make_private
    update_subscription(private: true)
  end

  def completed?
    @completed || false
  end

  def public?
    !(private?)
  end

  def private?
    private
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

  def accountability_partners
    @partners = update_accountability_partners if @partners.nil?  #cached so we allow iteration on this array
    return @partners
  end

  def remove_all_accountability
    update_accountability_partners if @partners.nil?
    @partners.each{|p| remove_accountability_user(p.id)}
  end

  def delete
    unsubscribe
  end

  def unsubscribe
    raise raise "Can't unsubscribe from a plan without authorization" unless auth
    destroy
  end

  def user=(u)
    @user = u
  end

  def user
    @user ||= User.find(auth ? auth : user_id.to_i)
  end

  def progress
    @attributes.completion_percentage
  end

  def day_statuses
    data, errs = self.class.get("#{api_path_prefix}/calendar", {auth: auth, id: id, user_id: user_id})
    results = YV::API::Results.new(data,errs)
      raise_errors( results.errors, "subscription#day_statuses") unless results.valid?

    return data
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
    opts = {auth: auth}
    opts[:page] = 1 #We only support 25 users (max in use is 19) until more are needed (then we can just get them all below)
    opts[:id] = id
    opts[:user_id] = user_id

    # Sample API response
    #  [{"total"=>1,
    #  "users"=>
    # [{"user_id"=>7541650,
    #   "username"=>"BrittTheIsh",
    #   "created_dt"=>"2013-09-11 17:36:10.613644+00"}],
    #  "next_page"=>nil},
    # nil]

    data, errs = self.class.get("#{api_path_prefix}/accountability", opts)
    results = YV::API::Results.new(data,errs)

    unless results.valid?
      if errs.size == 1 and [/not found/].detect {|reg| reg.match(errs.first.error)}
        return []
      else
        raise_errors( results.errors, "subscription#update_accountability_partners")
      end
    end

    @partners = data.users.map do |user_mash|
      Hashie::Mash.new({username: user_mash.username, id: user_mash.user_id.to_i})
    end
  end

  def update_subscription (opts = {})
    raise "Authentication required to update a reading plan" unless auth

    opts[:auth] = auth
    opts[:id] = id
    opts[:private] = self.private if opts[:private].nil?

    if opts[:email_delivery].blank?
      opts[:email_delivery] = opts[:email_delivery_version_id] = nil
    else
      opts[:email_delivery] ||= email_delivery
      opts[:email_delivery_version_id] ||= email_delivery_version_id
    end
    # email_delivery  00:00:00 FORMAT for time to deliver email
    # best if random to spread load (re: convo with CV)

    data, errs  = self.class.post("#{api_path_prefix}/update_subscribe_user", opts)
    results = YV::API::Results.new(data,errs)
      raise_errors(results.errors, "subscription#update_subscription") unless results.valid?
    
    @attributes.merge!(data)
  end

  def update_accountability(user, params={})
    raise "Authentication required to add accountability to a reading plan" unless auth
    raise "Provide an action for update: add or delete.  action: 'add'" unless params[:action]

    opts = {auth: auth, id: id}
    mode = params[:action]

    case user
    when User
      opts[:user_id] = user.id
    when Fixnum, /\A[\d]+\z/                    #id (possibly in string form)
      opts[:user_id] = user.to_i
    else                                        #hope the user find can handle it
      opts[:user_id] = User.find(user).id
    end

    data, errs = self.class.post("#{api_path_prefix}/#{mode}_accountability", opts)
    results = YV::API::Results.new(data,errs)
      raise_errors(results.errors, "subscription#update_accountability") unless results.valid?
      
    #TODO PERF: could probably just remove from the mash and be safe if we need to save this API call
    update_accountability_partners
  end

  def delivery_time(time_range)
    hours = case time_range
    when "morning"
      (4..6)        #4-6:59:59
    when "afternoon"
      (12..14)      #12-2:59:59
    when "evening"
      (16..18)      #4-6:59:59
    else
      (4..6)        #4-6:59:59 Morning seems preferred default #delivery_time(["morning","afternoon","evening"].sample)
    end

    "%02d:%02d:%02d" % [hours.to_a.sample, (0..59).to_a.sample, (0..59).to_a.sample]
  end
end