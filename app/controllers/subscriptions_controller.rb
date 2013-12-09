class SubscriptionsController < ApplicationController

  respond_to :html
  
  before_filter :force_login
  before_filter :find_subscription, only: [:show,:destroy,:edit,:update,:calendar]
  rescue_from NotAChapterError, with: :ref_not_found

  def index
    return render_404 if params[:user_id].to_s.downcase != current_auth.username.downcase

    @user = current_user
    @subscriptions = Subscription.all(@user, auth: @user.auth)
    self.sidebar_presenter = Presenter::Sidebar::Subscriptions.new(@subscriptions,params,self)
    respond_with(@subscriptions)
  end

  # TODO - ensure user subscribed.
  def show
    self.presenter = Presenter::Subscription.new( @subscription , params, self)
    self.sidebar_presenter = Presenter::Sidebar::Subscription.new( @subscription , params, self)
    now_reading(presenter.reference)
    respond_with(presenter.subscription)
  end

  def create
    if @subscription = subscription_for(params[:plan_id])
      redirect_to user_subscription_path(current_user,params[:plan_id]), notice: t("plans.already subscribed") and return
    end
    @subscription = Subscription.subscribe(params[:plan_id], current_auth)
    flash[:notice] = t("plans.subscribe successful")
    respond_with([@subscription], location: user_subscription_path(current_user,params[:plan_id]))
    # TODO look into having to do [@subcription] for first arg.  Getting error for .empty? here. Probably expecting something from ActiveRecord/Model
  end

  def destroy
    @subscription.destroy
    flash[:notice] = t("plans.unsubscribe successful")
    respond_with([@subscription], location: user_subscriptions_path(current_user))
    # TODO look into having to do [@subcription] for first arg.  Getting error for .empty? here. Probably expecting something from ActiveRecord/Model
  end

  def update

    if params[:catch_up] == "true"
      @subscription.catch_up
      action = 'catch up'
    end

    if params[:restart] == "true"
      @subscription.restart
      action = 'restart'
    end

    if (params[:make_public] == "true" || params[:make_private] == "true")
      params[:make_public] == "true" ? (@subscription.make_public and action = 'make public') : (@subscription.make_private and action = 'make private')
    end

    if(params[:email_delivery])
      if params[:email_delivery] == "false"
        @subscription.disable_email_delivery
        action = 'email delivery off'
      else
        @subscription.enable_email_delivery(time: params[:email_delivery], picked_version: params[:version], default_version: current_version)
        action = @subscription.delivered_by_email? ? 'email delivery updated' : 'email delivery on'
      end
    end

    if(params[:send_report])
      params[:send_report] == "true" ? (@subscription.add_accountability_user(current_user) and action = 'report on') : (@subscription.remove_all_accountability and action = 'report off')
    end

    if(params[:add_accountability_partner])
      @subscription.add_accountability_user(params[:add_accountability_partner])
      action = 'partner added'
      t_opts = {username: params[:add_accountability_partner]}
    end

    if(params[:remove_accountability_partner])
      @subscription.remove_accountability_user(params[:remove_accountability_partner])
      action = 'partner removed'
      t_opts = {username: params[:remove_accountability_partner]}
    end

    # Completing a day of reading
    if(params[:completed])
      @subscription.set_ref_completion(params[:day_target], params[:ref], params[:completed] == "true")
      if @subscription.completed?
        redirect_to(user_subscriptions_path(current_auth.username), notice: t("plans.completed notice")) and return
      else
        redirect_to user_subscription_path(current_user, @subscription, content: params[:content_target], day: params[:day_target], version: params[:version]) and return
      end
    end

    flash[:notice] = t("plans.#{action} successful", t_opts)
    redirect_to edit_user_subscription_path(current_user,@subscription)
  end

  def edit
    self.presenter          = Presenter::Subscription.new(@subscription,params,self)
    self.sidebar_presenter  = Presenter::Sidebar::SubscriptionProgress.new(@subscription,params,self)
  end

  def calendar
    self.presenter          = Presenter::Subscription.new(@subscription,params, self)
    self.sidebar_presenter  = Presenter::Sidebar::SubscriptionProgress.new(@subscription,params,self)
  end

  # Verb: the act of shelving your reading plan. Putting a book on the shelf.
  # This is a controller/action server side end point to pull a visitor out of 'reading plan mode'
  # Might also be a nice metric to capture, this provides an appropriate hook for capture.
  # POST
  def shelf
    redirect_to(bible_path(last_read))
  end

  # action/endpoint for rendering subscription sidebar controls when not on subscription#show
  def sidebar
    subscription = subscription_for(params[:id])
    render partial: "/sidebars/subscriptions/show",
           locals: {presenter: Presenter::Sidebar::Subscription.new( subscription , params, self )},
           layout: false
  end

  private

  def find_subscription
    unless @subscription = subscription_for(params[:id])
      redirect_to user_subscriptions_path(current_user)
    end

    # render 404 if day param is present and is not a valid day for the subscription
    day_param = params[:day]
    return render "pages/error_404" if day_param && !(1..@subscription.total_days).include?(day_param.to_i)
  end

  def subscription_for( plan_id )
    Subscription.find(plan_id, auth: current_auth)
  end

  def ref_not_found
    @title = @subscription.name
    self.presenter = Presenter::Subscription.new( @subscription , params, self)
    self.sidebar_presenter = Presenter::Sidebar::Subscription.new( @subscription , params, self)
    render 'plans/invalid_ref'
   end

end
