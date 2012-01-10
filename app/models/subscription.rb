class Subscription < Plan

  attribute :user_id
  attribute :private
  attribute :system_accountability
  attribute :group_id
  
  def user
      @user ||= User.find(auth ? auth : user_id)
  end

  def start
      @start ||= Date.parse(@attributes.start)
  end
  
  def end
      @end ||= Date.parse(@attributes.end)
  end

  def reading_date(day)
    start + day
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
  (Date.today - start).to_i + 1

      #TODO: make sure this is logically correct, and make it work with time zones

      #Old PHP code for this function
      #     //if the users timezone isn't set in the db use UTC
      # if($timezone === '' OR $timezone === FALSE)
      # {
      #   $timezone = 'UTC';
      # }
      # 
      # date_default_timezone_set($timezone);
      # 
      # $start_dt = new DateTime($start);
      # $current_dt = new DateTime(NULL, new DateTimeZone($timezone));
      # 
      # $current_diff = $start_dt->diff($current_dt);
      # $current_day = $current_diff->days + 1;
      # 
      # if ($current_diff->invert === 1)
      # {
      #   $current_day = 1;
      # }
      # 
      # if ($current_day > $total_days)
      # {
      #   if ($rollover === TRUE)
      #   {
      #     $current_day = $current_day % $total_days;
      #   }
      #   else
      #   {
      #     $current_day = $total_days;
      #   }
      # }
      # 
      # return $current_day;
  end
    
  def next_day
    validate_reading_json(current_day)
    
    @reading_json.next
  end
  
  def previous_day
    validate_reading_json(current_day)
    
    @reading_json.previous
  end
    
  def current_reading
    reading(current_day)
  end
  
  def reading(day)
    
    validate_reading_json(day)
    
    reading = Hashie::Mash.new()

    reading.devotional = @reading_json.additional_content_html || YouVersion::Resource.i18nize(@reading_json.additional_content)

    reading.references = @reading_json.adjusted_days.first.references.map {|data| Hashie::Mash.new(ref: Reference.new(data.reference.osis), completed?: (data.completed == "true"))}    
    
    reading
    
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
      response = YouVersion::Resource.post('reading_plans/reset', {auth: auth, id: id}) do |errors|
          raise YouVersion::ResourceError.new(errors)
      end
      @attributes.merge!(response)
    else
      raise "Authentication required to catch up on a plan"
    end  
  end
  
  def restart
    if auth
      response = YouVersion::Resource.post('reading_plans/restart', {auth: auth, id: id}) do |errors|
          raise YouVersion::ResourceError.new(errors)
      end
      @attributes.merge!(response)
    else
      raise "Authentication required to restart a reading plan"
    end
  end
  
  def delete_path
    "#{api_path_prefix}/unsubscribe_user"
  end
  
  def delete
    destroy
  end
  
  def unsubscribe
    destroy
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
  
  def accountability
    Hashie::Mash.new({send_reminder?: true, report_recipients: ["me", "them"]})
  end
  
  private
  
  def validate_reading_json(day)
    
    #TODO:? check that day is number
    #TODO: are we ok to assume auth is the same as the response cached for this request?
    unless(@reading_json && @reading_json.day == day && @reading_json.id == id)
      opts = {day: day}
      opts[:id] = id
      opts[:auth] ||= @attributes[:auth]
      opts[:user_id] = user_id unless opts[:auth].nil?
      @reading_json = YvApi.get("reading_plans/references", opts) do |errors|
          raise YouVersion::ResourceError.new(errors)
      end
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
      opts[:accountability] = system_accountability
      
      # Note: Not a partial update, if I don't pass these items, they will be overwritten by defaults.
      # id  of reading plan
      # start date to start reading plan on
      # end date to end reading plan on (required if total_days isn't sent, most send total_days)
      # total_days  of reading plan subscription length, normally you just use the value supplied in the view method
      # group_id  of group that the user subscribed as a result of, so if a group starts a reading plan and a user subscribes off that group, we track the group id here so that we have record of it
      # private true/false on whether the subscription should be private
      # system_accountability true/false on whether you want the system to send you weekly reminders about your progress, can be turned off at a later time
      response = YouVersion::Resource.post('reading_plans/update_subscribe_user', opts) do |errors|
          raise YouVersion::ResourceError.new(errors)
      end
      @attributes.merge!(response)
    else
      raise "Authentication required to unsubscribe from a reading plan"
    end
  end

end