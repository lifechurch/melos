class Subscription < Plan

  def start
      @start ||= Date.parse(@attributes.start)
  end
  
  def end
      @end ||= Date.parse(@attributes.end)
  end

  def progress
    @progress ||= @attributes.completion_percentage
  end
  
  def days
    @total_days ||= @attributes.subscription_total_days
  end
  
  def total_days
    days
  end
  
  def current_day
    
    (Date.today - start).to_i
        
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
  
end