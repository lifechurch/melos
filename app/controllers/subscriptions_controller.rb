class SubscriptionsController < ApplicationController

  before_filter :force_login
  respond_to :html #, :json #uncomment for .json representation of subscriptions.

  def sidebar
    presenter = Presenter::Sidebar::Subscription.new(params[:id] , params, self)
    render partial: "/sidebars/subscriptions/show", locals: {presenter: presenter}, layout: false
  end

  def index
    # Avoid extra api call for user here
    @user = (params[:user_id].to_s == current_user.try(:username).to_s) ? current_user : User.find(params[:user_id])
    @subscriptions = @user.subscriptions
    self.sidebar_presenter = Presenter::Sidebar::Subscriptions.new(@subscriptions,params,self)
    respond_with(@subscriptions)
  end

  # TODO - ensure user subscribed.
  def show
    #@subscription = subscription_for(params[:id])
    client_settings.app_state       = YouVersion::ClientSettings::SUBSCRIPTION_STATE
    client_settings.subscription_id = params[:id] #@subscription.id

    # TODO: Need to decorate or compose the sidebar presenter rather than
    # have an essentially duplicate presenter for the sidebar.
    @presenter = Presenter::Subscription.new(params[:id] , params, self)
    self.sidebar_presenter = Presenter::Sidebar::Subscription.new(params[:id] , params, self)
    now_reading(@presenter.reference)
    respond_with(@presenter.subscription)
  end

  def devotional
    @presenter = Presenter::Subscription.new(params[:id] , params, self)
    self.sidebar_presenter = Presenter::Sidebar::Subscription.new(params[:id] , params, self)
    respond_with(@presenter.subscription)
  end

  def create
    if @subscription = subscription_for(params[:plan_id])
      redirect_to user_subscription_path(current_user,params[:plan_id]), notice: t("plans.already subscribed") and return
    end
    @subscription = Plan.subscribe(params[:plan_id], current_auth)
    flash[:notice] = t("plans.subscribe successful")
    respond_with([@subscription], location: user_subscription_path(current_user,params[:plan_id]))
    # TODO look into having to do [@subcription] for first arg.  Getting error for .empty? here. Probably expecting something from ActiveRecord/Model
  end

  def destroy
    @subscription = subscription_for(params[:id])
    @subscription.destroy
    flash[:notice] = t("plans.unsubscribe successful")
    respond_with([@subscription], location: user_subscriptions_path(current_user))
    # TODO look into having to do [@subcription] for first arg.  Getting error for .empty? here. Probably expecting something from ActiveRecord/Model
  end

  def update
    @subscription = subscription_for(params[:id])
    raise "you can't view a plan's settings unless you're subscribed" if @subscription.nil?

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
      anchor = 'privacy'
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
      anchor = 'accountability'
    end

    if(params[:add_accountability_partner])
      @subscription.add_accountability_user(params[:add_accountability_partner])
      action = 'partner added'
      t_opts = {username: params[:add_accountability_partner]}
      anchor = 'accountability'
    end

    if(params[:remove_accountability_partner])
      @subscription.remove_accountability_user(params[:remove_accountability_partner])
      action = 'partner removed'
      t_opts = {username: params[:remove_accountability_partner]}
      anchor = 'accountability'
    end

    # Completing a day of reading
    if(params[:completed])
      @subscription.set_ref_completion(params[:day_target] || @subscription.current_day, params[:ref], params[:completed] == "true")
      redirect_to user_subscription_path(current_user, @subscription, content: params[:content_target], day: params[:day_target], version: params[:version]) and return
    end

    flash[:notice] = t("plans.#{action} successful", t_opts)
    redirect_to edit_user_subscription_path(current_user,@subscription,anchor: anchor)
  end

  # TODO - ensure user subscribed.
  def edit
    @presenter = Presenter::Subscription.new(params[:id] , params, self)
    self.sidebar_presenter = Presenter::Sidebar::SubscriptionProgress.new(params[:id],params,self)
  end

  # TODO - ensure user subscribed.
  def calendar
    @presenter = Presenter::Subscription.new(params[:id] , params, self)
    self.sidebar_presenter = Presenter::Sidebar::SubscriptionProgress.new(params[:id],params,self)
    #raise "you can't view a plan's calendar unless you're subscribed" if @subscription.nil?
  end

  # Verb: the act of shelving your reading plan. Putting a book on the shelf.
  # This is a controller/action server side end point to pull a visitor out of 'reading plan mode'
  # Might also be a nice metric to capture, this provides an appropriate hook for capture.
  # POST
  def shelf
    presenter = Presenter::Subscription.new( params[:id], params, self)
    client_settings.app_state = YouVersion::ClientSettings::DEFAULT_STATE
    redirect_to(bible_path(last_read))
  end

  private

  def subscription_for( plan_id )
    Subscription.find(plan_id, current_auth.user_id, auth: current_auth)
  end

end