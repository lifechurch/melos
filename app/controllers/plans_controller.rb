class PlansController < ApplicationController
  before_filter :force_login, only: [:start, :update, :settings, :calendar, :mail_settings, :calendar]
  before_filter :set_nav
  rescue_from InvalidReferenceError, with: :ref_not_found
  rescue_from YouVersion::API::RecordNotFound, with: :handle_404

  # TODO ALL/APPROPRIATE: respond_to / respond_with where at all possible
  def index
    @plan_lang      = available_plan_language()
    @plans = Plan.all( query: params[:query], page: params[:page] || 1, category: params[:category], language_tag: @plan_lang) rescue []
    @categories = CategoryListing.find(params[:category], language_tag: @plan_lang) rescue Hashie::Mash.new({current_name: t("plans.all"), breadcrumbs: [], items: []})
    @sidebar = false
    #PERF: We are wasting an API query here, maybe there is an elegant solution?
  end

  def show
    # Redirect for url format that is shared from mobile devices.
    if params[:day] then redirect_to( sample_plan_url(id: params[:id], day: params[:day])) and return end

    @plan = Plan.find(params[:id])
    if current_auth && current_user.subscribed_to?(@plan)
       redirect_to user_subscription_path(current_user,id: @plan.to_param,day: params[:day], content: params[:content]) and return
    else
      self.sidebar_presenter = Presenter::Sidebar::Plan.new(@plan,params,self)
    end
  end

  def sample
    @plan = Plan.find(params[:id])
    if current_auth && current_user.subscribed_to?(@plan)
       redirect_to user_subscription_path(current_user,id: @plan.to_param) and return
    else
      @presenter = Presenter::Subscription.new( @plan , params, self)
      self.sidebar_presenter = Presenter::Sidebar::PlanSample.new(@plan,params,self)
    end
  end

  def ref_not_found
    @presenter = Presenter::Subscription.new( @plan , params, self)
    self.sidebar_presenter = Presenter::Sidebar::PlanSample.new(@plan,params,self)
    render 'invalid_ref'
  end

  def handle_404(ex)
    @suggestion = ex.suggestion
    render "error_404"
  end

  # Actions needed to capture legacy links sent via email to our users. DO NOT remove
  # ---------------------------------------------------------------------------------
  # See routes.rb: "Community emails send this link"
  # TODO: get API team to update the link sent via email.
  def settings
    redirect_to edit_user_subscription_path( current_user, params[:id])
  end

  def calendar
    redirect_to calendar_user_subscription_path( current_user, params[:id])
  end

  private

  def set_nav
    @nav = :plans
  end

  def available_plan_language
    langs = [params[:lang],params[:locale],:en].compact
    langs.each {|lang| return lang.to_s if Plan.available_locales.include?(lang.to_sym)}
  end

end
