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
    #debugger
    #TODO: We are wasting an API query here, maybe there is an elegant solution?
    
  end

  def show
    @plan = Plan.find(params[:id], auth: current_auth) 
    
    if @subscription = current_user.subscriptions.find {|subscription| subscription == @plan}
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
      @subscription.set_ref_completion(params[:day_target], params[:ref], params[:completed] == "true")
      redirect_to plan_path(@plan, content: params[:content_target], day: params[:day_target])
    else
      #TODO: error
      puts "can't update a plan you aren't subscribed to"
    end
    
  end
  
  def start
    
    @plan = Plan.find(params[:plan_id]).subscribe(current_auth)
    #TODO: we're wasting an API call here (finding the plan just to subscribe)
    #TODO: handle the case where the user isn't logged in
    redirect_to plan_path(params[:plan_id])
    
  end

end
