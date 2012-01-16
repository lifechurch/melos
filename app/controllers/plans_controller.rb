class PlansController < ApplicationController

  def index
    if params[:user_id]
      @user = User.find(params[:user_id])  
      render :action => "index_subscriptions" 
    end
    
    params[:lang] ||= I18n.locale.to_s
    params[:language_tag] = params[:lang]
    @plans = Plan.all(params)
    @categories = CategoryListing.find(params[:category])
    #PERF: We are wasting an API query here, maybe there is an elegant solution?
  end

  def show
    @plan = Plan.find(params[:id], auth: current_auth) 
    
    if (@subscription = current_user.subscriptions.find {|subscription| subscription == @plan}) && (params[:ignore_subscription] != "true")
      #PERF: user.find_subsctiption would be faster
      params[:day] ||= @subscription.current_day
      @day = params[:day].to_i
      @reading = @subscription.reading(@day)
      @content_page = Range.new(0, @reading.references.count - 1).include?(params[:content].to_i) ? params[:content].to_i : 0
      
      render :action => "show_subscribed"
    end  
  end
  
  def update
    @plan = Plan.find(params[:id], auth: current_auth) 
    if @subscription = current_user.subscriptions.find {|subscription| subscription == @plan}
      @subscription.set_ref_completion(params[:day_target] || @subscription.current_day, params[:ref], params[:completed] == "true")
      redirect_to plan_path(@plan, content: params[:content_target], day: params[:day_target])
      #TODO: sender should send all parameters, then we should mask them with nils for default cases here
    else
      raise "you can't update a plan to which you aren't subscribed"
    end
  end
  
  def start
    @plan = Plan.find(params[:plan_id]).subscribe(current_auth)
    #TODO: we're wasting an API call here (finding the plan just to subscribe)
    #TODO: handle the case where the user isn't logged in
    redirect_to plan_path(params[:plan_id])
  end
  
  def settings
    @subscription = current_user.subscriptions.find {|subscription| subscription.slug == params[:plan_id]}
    
    raise "you can't view a plan's settings unless you're subscribed" if @subscription.nil?
    
    @subscription.catch_up if params[:catch_up] == "true"
    @subscription.restart if params[:restart] == "true"
    
    if (params[:make_public] == "true" || params[:make_private] == "true")
      params[:make_public] == "true" ? @subscription.make_public : @subscription.make_private
    end
    
    if(params[:unsubscribe] == "true")
      @subscription.destroy
      redirect user_plans_path(current_auth.user_id, alert: "unsubscribed")
    end
    
    if(params[:email_delivery])
      if params[:email_delivery] == "false"
        @subscription.disable_email_delivery
      else
        @subscription.enable_email_delivery(time: params[:email_delivery], picked_version: params[:version], default_version: current_version)
      end
    end
    
    if(params[:send_reminder])
      params[:send_reminder] == "true" ? @subscription.enable_reminder : @subscription.disable_reminder
    end
    
    if(params[:send_report])
      if(params[:send_report] == "true")
        @subscription.add_accountability_user(current_user)
      else
        @subscription.remove_all_accountability
      end
    end
    
    if(params[:add_accountability_partner])
        @subscription.add_accountability_user(params[:add_accountability_partner])
    end
    
    if(params[:remove_accountability_partner])
        @subscription.remove_accountability_user(params[:remove_accountability_partner])
    end
  end
  
  def calendar
    @subscription = current_user.subscriptions.find {|subscription| subscription.slug == params[:plan_id]}

    raise "you can't view a plan's calendar unless you're subscribed" if @subscription.nil? 
  end

end
