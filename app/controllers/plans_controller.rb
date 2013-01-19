class PlansController < ApplicationController
  before_filter :force_login, only: [:start, :update, :settings, :calendar]
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
    # TODO: redirect if user logged in and subscribed to this plan
    self.sidebar_presenter = Presenter::Sidebar::Plan.new(params[:id],params,self)
    @plan = sidebar_presenter.plan
  end

  def sample
    @presenter = Presenter::PlanSample.new(params[:id],params,self)
    self.sidebar_presenter = Presenter::Sidebar::Plan.new(@presenter.plan,params,self)
  end

  def ref_not_found
    @sidebar = false
    render 'invalid_ref'
  end

  private
  def set_nav
    @nav = :plans
  end
end
