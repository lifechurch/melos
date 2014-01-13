class SubscriptionsController < ApplicationController

  respond_to :html
  
  before_filter :check_existing_subscription, only: [:create]
  before_filter :force_login
  before_filter :find_subscription,     only: [:show,:destroy,:edit,:update,:calendar]
  
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
    @subscription = Subscription.subscribe(params[:plan_id], auth: current_auth)
    flash[:notice] = t("plans.subscribe successful")
    respond_with([@subscription], location: subscription_path(user_id: current_user.to_param, id: params[:plan_id]))
    # TODO look into having to do [@subcription] for first arg.  Getting error for .empty? here. Probably expecting something from ActiveRecord/Model
  end

  def destroy
    @subscription.destroy
    flash[:notice] = t("plans.unsubscribe successful")
    respond_with([@subscription], location: subscriptions_path(user_id: current_user.to_param))
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

    # Completing a day of reading
    if(params[:completed])
      @subscription.set_ref_completion(params[:day_target], params[:ref], params[:completed] == "true")
      if @subscription.completed?
        redirect_to(subscriptions_path(user_id: current_auth.username), notice: t("plans.completed notice")) and return
      else
        redirect_to subscription_path(user_id: current_user.to_param, id: @subscription, content: params[:content_target], day: params[:day_target], version: params[:version]) and return
      end
    end

    flash[:notice] = t("plans.#{action} successful")
    redirect_to edit_subscription_path(user_id: current_user.to_param, id: @subscription)
  end

  def edit
    default_presenters
  end

  def calendar
    default_presenters
  end

  private

  def check_existing_subscription
    plan_id = params[:plan_id]
    if subscription_for(plan_id)
      redirect_to(subscription_path(user_id: current_user.to_param, id: plan_id), notice: t("plans.already subscribed")) and return
    end
  end

  def default_presenters
    self.presenter          = Presenter::Subscription.new(@subscription,params,self)
    self.sidebar_presenter  = Presenter::Sidebar::SubscriptionProgress.new(@subscription,params,self)
  end

  def find_subscription
    unless @subscription = subscription_for(params[:id])
      redirect_to subscriptions_path(user_id: current_user.to_param)
    end

    # render 404 if day param is present and is not a valid day for the subscription
    day_param = params[:day]
    return render "pages/error_404" if day_param && !(1..@subscription.total_days).include?(day_param.to_i)

    # Set appropriate auth/user on subscription - TODO handle this in a cleaner way
    @subscription.auth = current_auth
    @subscription.user = current_user
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
