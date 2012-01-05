class Subscription < Plan

  attribute :user_id

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
    else
      raise "Authentication required to update plan progress"
    end
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

end