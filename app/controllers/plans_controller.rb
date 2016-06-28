class PlansController < ApplicationController
  before_filter :mobile_redirect, only: [:index, :show, :sample]
  before_filter :force_login, only: [:start, :update, :settings, :calendar, :mail_settings, :calendar]
  # before_filter -> { set_cache_headers 'short' }, only: [:index, :show, :sample]

  rescue_from InvalidReferenceError, with: :ref_not_found
  rescue_from YouVersion::API::RecordNotFound, with: :handle_404

  # TODO ALL/APPROPRIATE: respond_to / respond_with where at all possible

  # TODO - this needs serious refactoring controller, model, service object and template - A MESS.
  def index
    @plan_lang      = available_plan_language()
    @category = PlanCategory.find(params[:category], language_tag: @plan_lang)# rescue Hashie::Mash.new({current_name: t("plans.all"), breadcrumbs: [], items: []})
    @plan_lengths = []
    if params[:category].nil?
      params[:category] = "featured_plans"
    end

    # Need to query here to see if user has subscribe to any plans
    if current_user.present?
      @subscriptions = Subscription.all(current_user, auth: current_user.auth)
      @show_my_plans = @subscriptions.present? && @subscriptions.length > 0
    end

    @plans = Plan.all( query: params[:query], page: @page, category: params[:category], language_tag: @plan_lang)
    @sidebar = false
    if !@plans.nil?
      @plans.each do |plan|
        @plan_lengths.push plan.total_days unless @plan_lengths.include? plan.total_days
      end
    end
    @plan_lengths = @plan_lengths.sort
    @stophere = 1
    #PERF: We are wasting an API query here, maybe there is an elegant solution?
  end

  def show
    # Redirect for url format that is shared from mobile devices.
    if params[:day] then redirect_to( sample_plan_url(id: params[:id], day: params[:day])) and return end

    if current_user.present? && params[:back].present?
      if params[:back] = 'subscription'
        @referrer = subscription_path(user_id: current_user.to_param, id: params[:id])
      end
    end

    @plan = Plan.find(params[:id])

    if @plan.valid?
      begin
      @friends_reading = @plan.friends_reading(auth: current_auth)
      @friends_completed = @plan.friends_completed(auth: current_auth)
      rescue => e
      end
      self.sidebar_presenter = Presenter::Sidebar::Plan.new(@plan,params,self)

      # Need to query here to see if user has subscribe to any plans
      if current_user.present?
        @subscriptions = Subscription.all(current_user, auth: current_user.auth)
        @show_my_plans = @subscriptions.present? && @subscriptions.length > 0
        @my_saved_items = Subscription.allSavedIds(current_user)
        if @my_saved_items.reading_plans.is_a? Array
          @is_saved = @my_saved_items.reading_plans.include? @plan.id
        else
          @is_saved = false
        end
      end
      
    else
      render_404
    end
  end

  def sample
    respond_to do |format|
      format.json { return render nothing: true }
      format.any {
        @plan = Plan.find(params[:id])
        @referrer = request.referrer

        # render 404 unless day param is a valid day for the plan
        return handle_404 if @plan.errors.present?
        return handle_404 unless (1..@plan.total_days).include?(params[:day].to_i)

        if current_auth && current_user.subscribed_to?(@plan)
          redirect_to subscription_path(user_id: current_user.to_param,id: @plan.to_param) and return
        end

        @presenter = Presenter::Subscription.new( @plan , params, self)
        self.sidebar_presenter = Presenter::Sidebar::PlanSample.new(@plan,params,self)

        return render
      }
    end
  end

  def ref_not_found
    @title = @plan.name
    @presenter = Presenter::Subscription.new( @plan , params, self)
    self.sidebar_presenter = Presenter::Sidebar::PlanSample.new(@plan,params,self)
    render 'invalid_ref'
  end

  def handle_404(ex = nil)
    @suggestion = ex.try(:suggestion)
    render "error_404"
  end

  def my_plans_link
    if current_auth
      return render :text => subscriptions_path(user_id: current_auth.username)
    else
      return render nothing: true
    end
  end

  # Actions needed to capture legacy links sent via email to our users. DO NOT remove
  # ---------------------------------------------------------------------------------
  # See routes.rb: "Community emails send this link"
  # TODO: get API team to update the link sent via email.
  def settings
    redirect_to edit_subscription_path( user_id: current_user.to_param, id: params[:id])
  end

  def calendar
    redirect_to calendar_subscription_path( user_id: current_user.to_param, id: params[:id])
  end

  private

  def available_plan_language
    # Locale HAX because API returns only "pt" for Reading Plan available locales
    # If we're pt-BR locale, then we map that to pt for the time being until further progress
    # has been made on backend API decisions, locales and reading plans
    # pt-PT shouldn't be mapped at the moment.

    locale = (params[:locale] == "pt-BR") ? "pt" : params[:locale]
    lang   = (params[:lang] == "pt-BR") ? "pt" : params[:lang]

    langs = [lang,locale,"en"].compact    #order here is important - we start with override lang, then locale as param, then default to "en"
    available_locales = Plan.available_locales.map {|loc| loc.to_s}   # get available locales in array of strings
    langs.each {|l| return l if available_locales.include?(l)}        # so we can compare lang to string rather than symbol
  end

  def current_user
    return nil unless current_auth
    @current_user ||= User.find(current_auth.user_id, auth: current_auth)
  end

end
