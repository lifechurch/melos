class PlansController < ApplicationController

  def index
    if params[:user_id]
      @user = User.find(params[:user_id])  
      render :action => "index_subscriptions" 
    end
    @plans = Plan.all(params)
    @categories = CategoryListing.find(params[:category])
    #TODO: We are wasting an API query here, maybe there is an elegant solution?
    
  end

  def show      
    @plan = Plan.find(params[:id])  
    
    if current_user.subscriptions.include?(@plan)
      @subscription = Subscription.find(@user, @plan, auth: current_auth)
      redirect_to params.merge!(day: @subscription.current_day) unless params[:day]
      #TODO: is this horrifically inefficient, since the common case is the redirect (and thus extra API calls)?
       
      render :action => "show_subscribed"
    end  

  end
  
end
