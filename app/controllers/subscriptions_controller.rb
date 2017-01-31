class SubscriptionsController < ApplicationController

  respond_to :html, :json
  prepend_before_filter :mobile_redirect, only: [:show]
  before_filter :check_existing_subscription, only: [:create]
  before_filter :force_login
  before_filter :find_subscription,     only: [:show,:ref,:devo,:destroy,:edit,:update,:calendar,:mark_complete]
  before_filter :setup_presenter, only: [:show,:devo,:ref,:mark_complete]
  before_filter :get_plan_counts, only: [:index,:completed,:saved]


  rescue_from NotAChapterError, with: :ref_not_found

  def index
    p = {
        "strings" => {},
        "languageTag" => I18n.locale.to_s,
        "url" => request.path,
        "cache_for" => YV::Caching::a_very_long_time
    }

    fromNode = YV::Nodestack::Fetcher.get('PlanDiscovery', p, cookies, current_auth, current_user, request)

    if (fromNode['error'].present?)
      return render_404
    end

    @title_tag = fromNode['head']['title']
    @node_meta_tags = fromNode['head']['meta']

    render 'index', locals: { html: fromNode['html'], js: fromNode['js'] }
  end

  def completed
    p = {
        "strings" => {},
        "languageTag" => I18n.locale.to_s,
        "url" => request.path,
        "cache_for" => YV::Caching::a_very_long_time
    }

    fromNode = YV::Nodestack::Fetcher.get('PlanDiscovery', p, cookies, current_auth, current_user, request)

    if (fromNode['error'].present?)
      return render_404
    end

    @title_tag = fromNode['head']['title']
    @node_meta_tags = fromNode['head']['meta']

    render 'index', locals: { html: fromNode['html'], js: fromNode['js'] }
  end

  def saved
    p = {
        "strings" => {},
        "languageTag" => I18n.locale.to_s,
        "url" => request.path,
        "cache_for" => YV::Caching::a_very_long_time
    }

    fromNode = YV::Nodestack::Fetcher.get('PlanDiscovery', p, cookies, current_auth, current_user, request)

    if (fromNode['error'].present?)
      return render_404
    end

    @title_tag = fromNode['head']['title']
    @node_meta_tags = fromNode['head']['meta']

    render 'index', locals: { html: fromNode['html'], js: fromNode['js'] }
  end

  # Plan Day: Overview
  def show
    p = {
        "strings" => {},
        "languageTag" => I18n.locale.to_s,
        "url" => request.fullpath,
        "id" => params[:id].split("-")[0],
        "day" => params[:day],
        "cache_for" => YV::Caching::a_very_long_time
    }

    fromNode = YV::Nodestack::Fetcher.get('PlanDiscovery', p, cookies, current_auth, current_user, request)

    if (fromNode['error'].present?)
      return render_404
    end

    @title_tag = fromNode['head']['title']
    @node_meta_tags = fromNode['head']['meta']

    render 'index', locals: { html: fromNode['html'], js: fromNode['js'] }
  end

  # Plan Day: Devo
  def devo
    p = {
        "strings" => {},
        "languageTag" => I18n.locale.to_s,
        "url" => request.fullpath,
        "cache_for" => YV::Caching::a_very_long_time
    }

    fromNode = YV::Nodestack::Fetcher.get('PlanDiscovery', p, cookies, current_auth, current_user, request)

    if (fromNode['error'].present?)
      return render_404
    end

    @title_tag = fromNode['head']['title']
    @node_meta_tags = fromNode['head']['meta']

    render 'index', locals: { html: fromNode['html'], js: fromNode['js'] }
  end

  # Plan Day: Ref
  def ref
    p = {
        "strings" => {},
        "languageTag" => I18n.locale.to_s,
        "url" => request.fullpath,
        "cache_for" => YV::Caching::a_very_long_time
    }

    fromNode = YV::Nodestack::Fetcher.get('PlanDiscovery', p, cookies, current_auth, current_user, request)

    if (fromNode['error'].present?)
      return render_404
    end

    @title_tag = fromNode['head']['title']
    @node_meta_tags = fromNode['head']['meta']

    render 'index', locals: { html: fromNode['html'], js: fromNode['js'] }
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
      return redirect_to subscription_path(user_id: current_user.to_param, id: @subscription)
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
    if(params[:completed].present?)
      @subscription.set_ref_completion(params[:day], params[:ref], params[:devo], params[:completed] == "true")
      @subscription = subscription_for(params[:id]) || @subscription

      # after changing refs, fall back to version_id of plan if specified
      params[:initial] = true

      self.presenter = Presenter::Subscription.new( @subscription , params, self)

      if !@subscription.completed?
        dayComplete = @subscription.day_statuses[params[:day].to_i - 1].completed unless @subscription.day_statuses[params[:day].to_i - 1].blank?

        #Just Completed Day
        if dayComplete
          return render "subscriptions/day_complete"

        #Just completed Devo
        elsif !params[:ref].present?
          if !params[:stay].present?
            redirectUrl = ref_subscription_path(user_id: current_user.to_param, id: @subscription, day: params[:day], content: 0)
          else
            redirectUrl = subscription_path(user_id: current_user.to_param, id: @subscription, day: params[:day])
          end

        #Just completed Ref
        elsif params[:content].present?
          next_ref_index = params[:content].to_i + 1
          references = presenter.reading.references(version_id: @subscription.version_id)
          if !params[:stay].present? && next_ref_index < references.length
            redirectUrl = ref_subscription_path(user_id: current_user.to_param, id: @subscription, day: params[:day], content: next_ref_index)
          else
            # Made it to the end, but skipped some content
            # Send them back to overview
            redirectUrl = subscription_path(user_id: current_user.to_param, id: @subscription, day: params[:day])
          end

        end

      #Just Completed Plan
      else
        @featured_plans = Plan.featured(language_tag: current_locale)
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

  # for marking day complete from subscription email
  def mark_complete
    refs = presenter.reading.references(version_id: presenter.subscription.version_id)
    refs.each_with_index { |ref,index|
      if(ref.completed == false)
        ref.completed = true
        @subscription.set_ref_completion(params[:day], ref.reference.to_param.downcase , ref.reference.to_param.downcase.present?, true)
      end
    }

    # after changing refs, fall back to version_id of plan if specified
    params[:initial] = true

    @subscription = subscription_for(params[:id]) || @subscription
    self.presenter = Presenter::Subscription.new( @subscription , params, self)

    if @subscription.completed?
      @featured_plans = Plan.featured(language_tag: current_locale)
      @saved_plans = Subscription.saved(current_user, id: current_user.id, auth: current_auth)
      return render "subscriptions/plan_complete"
    else
      return render "subscriptions/day_complete"
    end
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
    # after changing refs, fall back to version_id of plan if specified
    params[:initial] = true

    self.presenter = Presenter::Subscription.new( @subscription , params, self)
  end

  def subscription_for( plan_id )
    Subscription.find(plan_id, auth: current_auth)
  end

  def ref_not_found
    @title = @subscription.name

    # after changing refs, fall back to version_id of plan if specified
    params[:initial] = true

    self.presenter = Presenter::Subscription.new( @subscription , params, self)
    self.sidebar_presenter = Presenter::Sidebar::Subscription.new( @subscription , params, self)
    render 'plans/invalid_ref'
  end

  def get_plan_counts
    @user = current_user

    @allSaved = Subscription.allSavedIds(@user)
    @allCompleted = Subscription.completed_all_items(@user)

    @savedCount = 0
    if @allSaved.reading_plans.present? && @allSaved.reading_plans.respond_to?('length')
      @savedCount = @allSaved.reading_plans.length
    end

    @completedCount = 0
    if @allCompleted.reading_plans.present? && @allCompleted.reading_plans.respond_to?('length')
      @completedCount = @allCompleted.reading_plans.length
    end
  end

end
