class PlansController < ApplicationController
  before_filter :mobile_redirect, only: [:index, :show, :sample]
  before_filter :force_login, only: [:start, :update, :settings, :calendar, :mail_settings, :calendar]
  # before_filter -> { set_cache_headers 'short' }, only: [:index, :show, :sample]

  rescue_from InvalidReferenceError, with: :ref_not_found
  rescue_from YouVersion::API::RecordNotFound, with: :handle_404

  # TODO ALL/APPROPRIATE: respond_to / respond_with where at all possible

  # TODO - this needs serious refactoring controller, model, service object and template - A MESS.
  def index
    p = {
        "strings" => {},
        "languageTag" => I18n.locale.to_s,
        "url" => request.path,
        "cache_for" => YV::Caching::a_very_long_time
    }

    fromNode = YV::Nodestack::Fetcher.get('PlanDiscovery', p, cookies, current_auth, current_user, request, cookie_domain)

    if (fromNode['error'].present?)
      # puts "-"*100
      # puts fromNode["stack"]
      # puts "-"*100
      return render_404
    end

    @title_tag = fromNode['head']['title']
    @node_meta_tags = fromNode['head']['meta']

    render locals: { html: fromNode['html'], js: add_node_assets(fromNode['js']), css: add_node_assets(fromNode['css']), css_inline: fromNode['css_inline'] }
  end

  def plan_collection
    p = {
        "strings" => {},
        "languageTag" => I18n.locale.to_s,
        "url" => request.path,
        "id" => params[:id].split("-")[0],
        "cache_for" => YV::Caching::a_very_long_time
    }

    fromNode = YV::Nodestack::Fetcher.get('PlanDiscovery', p, cookies, current_auth, current_user, request, cookie_domain)

    if (fromNode['error'].present?)
      return render_404
    end

    @title_tag = fromNode['head']['title']
    @node_meta_tags = fromNode['head']['meta']

    render locals: { html: fromNode['html'], js: add_node_assets(fromNode['js']), css: add_node_assets(fromNode['css']), css_inline: fromNode['css_inline'] }
  end

  def show
    if (params[:add_to_queue].present?)
      return save_for_later_action
    end

    if (params[:subscribe].present?)
      return subscribe_user_action
    end

    p = {
        "strings" => {},
        "languageTag" => I18n.locale.to_s,
        "url" => request.path,
        "id" => params[:id].split("-")[0],
        "cache_for" => YV::Caching::a_very_long_time
    }

    fromNode = YV::Nodestack::Fetcher.get('PlanDiscovery', p, cookies, current_auth, current_user, request, cookie_domain)

    if (fromNode['error'].present?)
      return render_404
    end

    @title_tag = fromNode['head']['title']
    @node_meta_tags = fromNode['head']['meta']
    @deeplink_plan_id = p['id']
    render locals: { html: fromNode['html'], js: add_node_assets(fromNode['js']), css: add_node_assets(fromNode['css']), css_inline: fromNode['css_inline'] }
  end

  # action and view from node server for save for later url (from email link)
  def save_for_later_action
    p = {
        "strings" => {},
        "languageTag" => I18n.locale.to_s,
        "url" => request.fullpath,
        "id" => params[:id].split("-")[0],
        "cache_for" => YV::Caching::a_very_long_time
    }

    if (!current_auth)
      redirect_to sign_in_path(redirect: plan_path(id: params[:id], add_to_queue: true)) and return
    end

    fromNode = YV::Nodestack::Fetcher.get('SaveForLater', p, cookies, current_auth, current_user, request, cookie_domain)

    if (fromNode['error'].present?)
      return render_404
    end

    @title_tag = fromNode['head']['title']
    @node_meta_tags = fromNode['head']['meta']
    render 'save_for_later_action', locals: { html: fromNode['html'] }
  end

  # action and view from node server for subscribe user url (from email link)
  def subscribe_user_action
    p = {
        "strings" => {},
        "languageTag" => I18n.locale.to_s,
        "url" => request.fullpath,
        "id" => params[:id].split("-")[0],
        "cache_for" => YV::Caching::a_very_long_time
    }

    if (!current_auth)
      redirect_to sign_in_path(redirect: plan_path(id: params[:id], subscribe: true)) and return
    end

    fromNode = YV::Nodestack::Fetcher.get('SubscribeUser', p, cookies, current_auth, current_user, request, cookie_domain)

    if (fromNode['error'].present?)
      return render_404
    end

    @title_tag = fromNode['head']['title']
    @node_meta_tags = fromNode['head']['meta']

    render 'subscribe_user_action', locals: { html: fromNode['html'], js: add_node_assets(fromNode['js']), css: add_node_assets(fromNode['css']), css_inline: fromNode['css_inline'] }
  end

  def sample
    p = {
        "strings" => {},
        "languageTag" => I18n.locale.to_s,
        "url" => request.path,
        "day" => params[:day],
        "id" => params[:id].split("-")[0],
        "cache_for" => YV::Caching::a_very_long_time
    }

    fromNode = YV::Nodestack::Fetcher.get('PlanDiscovery', p, cookies, current_auth, current_user, request, cookie_domain)

    if (fromNode['error'].present?)
      return render_404
    end

    @title_tag = fromNode['head']['title']
    @node_meta_tags = fromNode['head']['meta']
    @deeplink_plan_id = p['id']
    render 'index', locals: { html: fromNode['html'], js: add_node_assets(fromNode['js']), css: add_node_assets(fromNode['css']), css_inline: fromNode['css_inline'] }
    # respond_to do |format|
    #   format.json { return render nothing: true }
    #   format.any {
    #     @plan = Plan.find(params[:id])
    #     @referrer = request.referrer
    #
    #     # render 404 unless day param is a valid day for the plan
    #     return handle_404 if @plan.errors.present?
    #     return handle_404 unless (1..@plan.total_days).include?(params[:day].to_i)
    #
    #     # always defer to version_id of plan, if specified, when rendering sample view
    #     params[:initial] = true
    #
    #     if current_auth && current_user.subscribed_to?(@plan)
    #       redirect_to subscription_path(user_id: current_user.to_param,id: @plan.to_param) and return
    #     end
    #
    #     @presenter = Presenter::Subscription.new( @plan , params, self)
    #     self.sidebar_presenter = Presenter::Sidebar::PlanSample.new(@plan,params,self)
    #
    #     return render
    #   }
    # end
  end

  def day_complete
    # @plan = Plan.find(params[:id])
    # @user = User.find(params[:user_id])
    # @day = params[:day]
    # render 'subscriptions/day_complete'
    p = {
        "strings" => {},
        "languageTag" => I18n.locale.to_s,
        "url" => request.path,
        "id" => params[:id].split("-")[0],
        "user_id" => params[:user_id],
        "cache_for" => YV::Caching::a_very_long_time
    }

    fromNode = YV::Nodestack::Fetcher.get('PlanDiscovery', p, cookies, current_auth, current_user, request, cookie_domain)

    if (fromNode['error'].present?)
      return render_404
    end

    @title_tag = fromNode['head']['title']
    @node_meta_tags = fromNode['head']['meta']

    render 'index', locals: { html: fromNode['html'], js: add_node_assets(fromNode['js']), css: add_node_assets(fromNode['css']), css_inline: fromNode['css_inline'] }
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


  # ABS LOOKINSIDE
  def lookinside_view
    # what plans are we allowing for this view?
    whitelist = [2614, 2217, 3400]
    p = {
        "strings" => {},
        "languageTag" => I18n.locale.to_s,
        "url" => request.path,
        "referrer" => request.referrer,
        "id" => params[:id].split("-")[0],
        "day" => params[:day],
        "cache_for" => YV::Caching::a_very_long_time
    }

    # check to make sure we allow the plan
    # otherwise redirect to plan discovery page
    redirect = true
    for planid in whitelist
      if (p["id"].to_s == planid.to_s)
        redirect = false
      end
    end

    if (redirect)
      redirect_to plans_path() and return
    end

    fromNode = YV::Nodestack::Fetcher.get('PlanDiscovery', p, cookies, current_auth, current_user, request, cookie_domain)

    if (fromNode['error'].present?)
      return render_404
    end

    @title_tag = fromNode['head']['title']
    @node_meta_tags = fromNode['head']['meta']

    render 'index', locals: { html: fromNode['html'], js: add_node_assets(fromNode['js']), css: add_node_assets(fromNode['css']), css_inline: fromNode['css_inline'] }
  end
  def lookinside_sample
    return lookinside_view
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
