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
    #PERF: We are wasting an API query here, maybe there is an elegant solution?
  end

  def show
    # TODO: redirect if user logged in and subscribed to this plan
    @plan = Plan.find(params[:id])
  end

  def users_index
    if params[:plan_id]
      @plan = Plan.find(params[:plan_id])
      @users = @plan.users(page: params[:page])
    end
  end

  def calendar
    @subscription = Subscription.find(params[:plan_id], current_auth.user_id, auth: current_auth)

    raise "you can't view a plan's calendar unless you're subscribed" if @subscription.nil?
  end

  def ref_not_found
    render 'invalid_ref'
  end

  private
  def set_nav
    @nav = :plans
  end
end
