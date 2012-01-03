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
        render :action => "show_subscribed"
    end  

  end
  
  def start
    
    @plan = Plan.find(params[:plan_id]).subscribe(current_auth)
    #TODO: we're wasting an API call here (finding the plan just to subscribe)
    #TODO: handle the case where the user isn't logged in
    redirect_to plan_path(params[:plan_id])
    
  end

end
