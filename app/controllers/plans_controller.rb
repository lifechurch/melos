class PlansController < ApplicationController
  before_filter :force_login, only: [:start, :update, :settings, :calendar, :mail_settings, :calendar]
  before_filter :set_nav
  rescue_from InvalidReferenceError, with: :ref_not_found

  # TODO ALL/APPROPRIATE: respond_to / respond_with where at all possible
  def index
    @plan_lang = params[:lang] || I18n.locale.to_s
    @translate_list = params[:translate] == "true"
    @plans = Plan.all(params.merge(language_tag: @plan_lang)) rescue []
    @categories = CategoryListing.find(params[:category], language_tag: @plan_lang) rescue Hashie::Mash.new({current_name: t("plans.all"), breadcrumbs: [], items: []})
    @sidebar = false
    #PERF: We are wasting an API query here, maybe there is an elegant solution?
  end

  def show
    @plan = Plan.find(params[:id])
    if current_auth && current_user.subscribed_to?(@plan)
       redirect_to user_subscription_path(current_user,id: @plan.to_param,day: params[:day], content: params[:content]) and return
    else
      self.sidebar_presenter = Presenter::Sidebar::Plan.new(@plan,params,self)
    end
  end

  def sample
    #@presenter = Presenter::PlanSample.new(params[:id],params,self)
    @plan = Plan.find(params[:id])
    if current_auth && current_user.subscribed_to?(@plan)
       redirect_to user_subscription_path(current_user,id: @plan.to_param) and return
    else
      @presenter = Presenter::Subscription.new( @plan , params, self)
      self.sidebar_presenter = Presenter::Sidebar::PlanSample.new(@plan,params,self)
    end
  end

  def ref_not_found
    @sidebar = false
    render 'invalid_ref'
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
end
