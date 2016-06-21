class SubscriptionsController < ApplicationController

  respond_to :html, :json
  prepend_before_filter :mobile_redirect, only: [:show]
  before_filter :check_existing_subscription, only: [:create]
  before_filter :force_login
  before_filter :find_subscription,     only: [:show,:ref,:devo,:destroy,:edit,:update,:calendar]
  before_filter :setup_presenter, only: [:show,:devo,:ref]
  
  rescue_from NotAChapterError, with: :ref_not_found

  def index
    return render_404 if params[:user_id].to_s.downcase != current_auth.username.downcase

    @curpage = params[:page].present? ? params[:page].to_i : 1
    @user = current_user
    @subscriptions = Subscription.all(@user, auth: @user.auth, page: @curpage)

    return redirect_to plans_path if @subscriptions == false

    self.sidebar_presenter = Presenter::Sidebar::Subscriptions.new(@subscriptions,params,self)
    respond_with(@subscriptions)
  end

  def completed
    return render_404 if params[:user_id].to_s.downcase != current_auth.username.downcase

    @curpage = params[:page].present? ? params[:page].to_i : 1
    @user = current_user
    @subscriptions = Subscription.completed(@user, auth: @user.auth, page: @curpage)
    @completedList = true

    self.sidebar_presenter = Presenter::Sidebar::Subscriptions.new(@subscriptions,params,self)
    render 'index'
  end

  def saved
    return render_404 if params[:user_id].to_s.downcase != current_auth.username.downcase

    @curpage = params[:page].present? ? params[:page].to_i : 1
    @user = current_user
    @subscriptions = Subscription.saved(@user, auth: @user.auth, page: @curpage)
    @savedList = true

    self.sidebar_presenter = Presenter::Sidebar::Subscriptions.new(@subscriptions,params,self)
    render 'index'
  end

  # Plan Day: Overview
  def show
    return respond_with(presenter.subscription)
  end

  # Plan Day: Devo
  def devo
    return respond_with(presenter.subscription)
  end

  # Plan Day: Ref
  def ref
    now_reading(presenter.reference)
    return respond_with(presenter.subscription)
  end

  def create
    @subscription = Subscription.subscribe(params[:plan_id], auth: current_auth, private: params[:privacy].to_bool, language_tag: current_user.ensure_language_tag)
    flash[:notice] = t("plans.subscribe successful")
    respond_to do |format|
      format.json { render json: { notice: t("plans.subscribe successful")} }
      format.any { respond_with([@subscription], location: subscription_path(user_id: current_user.to_param, id: params[:plan_id], initial: 'true')) }
    end

    # TODO look into having to do [@subscription] for first arg.  Getting error for .empty? here. Probably expecting something from ActiveRecord/Model
  end

  def saveForLater
    @subscription = Subscription.saveForLater(params[:plan_id], auth: current_auth)
    respond_to do |format|
      format.json { render json: { success: @subscription.valid? } }
      format.any { render nothing: true }
    end
  end

  def removeSaved
    @subscription = Subscription.removeSaved(params[:plan_id], auth: current_auth)
    respond_to do |format|
      format.json { render json: { success: @subscription.valid? } }
      format.any { render nothing: true }
    end
  end

  def destroy
    @subscription.destroy
    flash[:notice] = t("plans.unsubscribe successful")
    respond_with([@subscription], location: subscriptions_path(user_id: current_user.to_param))
    # TODO look into having to do [@subscription] for first arg.  Getting error for .empty? here. Probably expecting something from ActiveRecord/Model
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

    if params[:stop] == "true"
      return destroy
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
      @subscription.set_ref_completion(params[:day], params[:ref], params[:ref].present?, params[:completed] == "true")
      self.presenter = Presenter::Subscription.new( @subscription , params, self)

      if !@subscription.completed?
        dayComplete = @subscription.day_statuses[params[:day].to_i - 1].completed unless @subscription.day_statuses[params[:day].to_i - 1].blank?

        #Just Completed Day
        if dayComplete
          return render "subscriptions/day_complete"

        #Just completed Devo
        elsif !params[:ref].present?
          redirectUrl = ref_subscription_path(user_id: current_user.to_param, id: @subscription, day: params[:day], content: 0)

        #Just completed Ref
        elsif params[:content].present?
          next_ref_index = params[:content].to_i + 1
          references = presenter.reading.references(version_id: @subscription.version_id)
          if next_ref_index < references.length
            redirectUrl = ref_subscription_path(user_id: current_user.to_param, id: @subscription, day: params[:day], content: next_ref_index)
          else
            # Made it to the end, but skipped some content
            # Send them back to overview
            redirectUrl = subscription_path(user_id: current_user.to_param, id: @subscription, day: params[:day])
          end

        end

      #Just Completed Plan
      else
<<<<<<< HEAD
        @featured_plans = Plan.featured()
=======
        @featured_plans = Plan.featured(language_tag: current_locale)
>>>>>>> YV-9181
        @saved_plans = Subscription.saved(current_user, id: current_user.id, auth: current_auth)
        return render "subscriptions/plan_complete"

      end

      return redirect_to(redirectUrl)
    end

    flash[:notice] = t("plans.#{action} successful")
    return redirect_to edit_subscription_path(user_id: current_user.to_param, id: @subscription)
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
      respond_to do |format|
        format.json { render json: { notice: t("plans.already subscribed") } }
        format.any  { redirect_to(subscription_path(user_id: current_user.to_param, id: plan_id), notice: t("plans.already subscribed")) and return }
      end
    end
  end

  def default_presenters
    self.presenter          = Presenter::Subscription.new(@subscription,params,self)
    self.sidebar_presenter  = Presenter::Sidebar::SubscriptionProgress.new(@subscription,params,self)
  end

  def find_subscription
    # If the user isn't subscribed, redirect to the plan page or their subscription page
    unless @subscription = subscription_for(params[:id])
      return redirect_to (plan_path(params[:id]) || subscriptions_path(user_id: current_user.to_param))
    end

    # render 404 if day param is present and is not a valid day for the subscription
    day_param = params[:day]
    return render "pages/error_404" if day_param && !(1..@subscription.total_days).include?(day_param.to_i)

    # Set appropriate auth/user on subscription - TODO handle this in a cleaner way
    @subscription.auth = current_auth
    @subscription.user = current_user
  end

  def setup_presenter
    self.presenter = Presenter::Subscription.new( @subscription , params, self)
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
