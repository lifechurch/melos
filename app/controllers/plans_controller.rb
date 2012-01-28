class PlansController < ApplicationController
  before_filter :force_login, only: [:start, :update, :settings, :calendar]
  
  def index
    if params[:user_id]
      @user = (params[:user_id] == current_user.username) ? current_user : User.find(params[:user_id])
      render :action => "index_subscriptions" 
    end
    
    params[:lang] ||= I18n.locale.to_s
    params[:language_tag] = params[:lang]
    @plans = Plan.all(params)
    @categories = CategoryListing.find(params[:category])
    #PERF: We are wasting an API query here, maybe there is an elegant solution?
  end

  def show
    @subscription = current_user.subscription(params[:id]) if current_user

    # if user is subscribed
    if (@subscription && (params[:ignore_subscription] != "true")) || params[:day]
      params[:day] ||= @subscription.current_day
      @subscription = Plan.find(params[:id]) if @subscription.nil?
      @day = params[:day].to_i
      @reading = @subscription.reading(@day)
      @content_page = Range.new(0, @reading.references.count - 1).include?(params[:content].to_i) ? params[:content].to_i : 0 #coerce content page to 1st page if outside range

      render :action => "show_subscribed"
    end  

    @plan = Plan.find(params[:id])
  end
  
  def users_index
    if params[:plan_id]
      @plan = Plan.find(params[:plan_id])
      @users = @plan.users(page: params[:page])
    end
  end
  
  def update
    force_login
    
    if @subscription = current_user.subscription(params[:id])
      @subscription.set_ref_completion(params[:day_target] || @subscription.current_day, params[:ref], params[:completed] == "true")
      redirect_to plan_path(@plan, content: params[:content_target], day: params[:day_target])
      #EVENTUALLY: sender should just send all parameters, then we should mask them with nils for default cases here in the controller -- this would be better abstraction
    else
      raise "you can't update a plan to which you aren't subscribed"
    end
  end
  
  def start    
    Plan.subscribe(params[:plan_id], current_auth)

    redirect_to plan_path(params[:plan_id]), notice: t("plans.subscribe successful")
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
      redirect_to user_plans_path(current_auth.username), notice: t("plans.unsubscribe successful")
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
    @subscription = current_user.subscription(params[:plan_id])

    raise "you can't view a plan's calendar unless you're subscribed" if @subscription.nil? 
  end
end
