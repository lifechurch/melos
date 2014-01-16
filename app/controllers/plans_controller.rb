class PlansController < ApplicationController
  before_filter :force_login, only: [:start, :update, :settings, :calendar, :mail_settings, :calendar]
  rescue_from InvalidReferenceError, with: :ref_not_found
  rescue_from YouVersion::API::RecordNotFound, with: :handle_404

  # TODO ALL/APPROPRIATE: respond_to / respond_with where at all possible

  # TODO - this needs serious refactoring controller, model, service object and template - A MESS.
  def index
    @plan_lang      = available_plan_language()
    @plans = Plan.all( query: params[:query], page: params[:page] || 1, category: params[:category], language_tag: @plan_lang)
    @category = PlanCategory.find(params[:category], language_tag: @plan_lang)# rescue Hashie::Mash.new({current_name: t("plans.all"), breadcrumbs: [], items: []})
    @sidebar = false
    #PERF: We are wasting an API query here, maybe there is an elegant solution?
  end

  def show
    # Redirect for url format that is shared from mobile devices.
    if params[:day] then redirect_to( sample_plan_url(id: params[:id], day: params[:day])) and return end

    @plan = Plan.find(params[:id])
    if current_auth && current_user.subscribed_to?(@plan)
       redirect_to subscription_path(user_id: current_user.to_param,id: @plan.to_param,day: params[:day], content: params[:content]) and return
    else
      self.sidebar_presenter = Presenter::Sidebar::Plan.new(@plan,params,self)
    end
  end

  def sample
    @plan = Plan.find(params[:id])

    # render 404 unless day param is a valid day for the plan
    return handle_404 unless (1..@plan.total_days).include?(params[:day].to_i)

    if current_auth && current_user.subscribed_to?(@plan)
       redirect_to subscription_path(user_id: current_user.to_param,id: @plan.to_param) and return
    end

    @presenter = Presenter::Subscription.new( @plan , params, self)
    self.sidebar_presenter = Presenter::Sidebar::PlanSample.new(@plan,params,self)
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
    available_locales = Plan.available_locales.map {|loc| loc.to_s}    # get available locales in array of strings
    langs.each {|l| return l.to_sym if available_locales.include?(l)}  # so we can compare lang to string rather than symbol
  end

end
