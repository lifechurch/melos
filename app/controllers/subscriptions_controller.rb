class SubscriptionsController < ApplicationController

  before_filter :force_login

  respond_to :html #, :json #uncomment for .json representation of subscriptions.

  def index
    @user = current_user
    @subscriptions = @user.subscriptions
    respond_with(@subscriptions)
  end

  # TODO - ensure user subscribed.
  def show

    @subscription = subscription_for(params[:id])

    # Get user font and size settings
    @font, @size = cookies['data-setting-font'], cookies['data-setting-size']

    if (params[:ignore_subscription] != "true") || params[:day]
      params[:day] ||= @subscription.current_day
      @day = params[:day].to_i
      @subscription.version_id = params[:version] || @subscription.version_id || current_version
      @version = Version.find(@subscription.version_id)
      @reading = @subscription.reading(@day)
      @content_page = Range.new(0, @reading.references.count - 1).include?(params[:content].to_i) ? params[:content].to_i : 0 #coerce content page to 1st page if outside range
      @reference = @reading.references[@content_page].ref unless @reading.references.empty?
    end

    respond_with(@subscription)
  end

  def orig
    @subscription = subscription_for(params[:id])

    # Get user font and size settings
    @font, @size = cookies['data-setting-font'], cookies['data-setting-size']

    if (params[:ignore_subscription] != "true") || params[:day]
      params[:day] ||= @subscription.current_day
      @day = params[:day].to_i
      @subscription.version_id = params[:version] || @subscription.version_id || current_version
      @version = Version.find(@subscription.version_id)
      @reading = @subscription.reading(@day)
      @content_page = Range.new(0, @reading.references.count - 1).include?(params[:content].to_i) ? params[:content].to_i : 0 #coerce content page to 1st page if outside range
      @reference = @reading.references[@content_page].ref unless @reading.references.empty?
    end

    respond_with(@subscription)
  end

  def create
    if @subscription = subscription_for(params[:plan_id])
      redirect_to user_subscription_path(current_user,params[:plan_id]), notice: t("plans.already subscribed") and return
    end
    @subscription = Plan.subscribe(params[:plan_id], current_auth)
    flash[:notice] = t("plans.subscribe successful")
    respond_with([@subscription], location: user_subscription_path(current_user,params[:plan_id]))
    # TODO look into having to do [@subcription] for first arg.  Getting error for .empty? here. Probably expecting something from ActiveRecord/Model
  end

  def destroy
    @subscription = subscription_for(params[:id])
    @subscription.destroy
    flash[:notice] = t("plans.unsubscribe successful")
    respond_with([@subscription], location: user_subscriptions_path(current_user))
    # TODO look into having to do [@subcription] for first arg.  Getting error for .empty? here. Probably expecting something from ActiveRecord/Model
  end

  def update
    @subscription = subscription_for(params[:id])
    raise "you can't view a plan's settings unless you're subscribed" if @subscription.nil?

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
      anchor = 'privacy'
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
      anchor = 'accountability'
    end

    if(params[:add_accountability_partner])
      @subscription.add_accountability_user(params[:add_accountability_partner])
      action = 'partner added'
      t_opts = {username: params[:add_accountability_partner]}
      anchor = 'accountability'
    end

    if(params[:remove_accountability_partner])
      @subscription.remove_accountability_user(params[:remove_accountability_partner])
      action = 'partner removed'
      t_opts = {username: params[:remove_accountability_partner]}
      anchor = 'accountability'
    end

    # Completing a day of reading
    if(params[:completed])
      @subscription.set_ref_completion(params[:day_target] || @subscription.current_day, params[:ref], params[:completed] == "true")
      redirect_to user_subscription_path(current_user, @subscription, content: params[:content_target], day: params[:day_target], version: params[:version]) and return
    end

    flash[:notice] = t("plans.#{action} successful", t_opts)
    redirect_to edit_user_subscription_path(current_user,@subscription,anchor: anchor)
  end

  # TODO - ensure user subscribed.
  def edit
    @subscription = Subscription.find(params[:id], current_auth.user_id, auth: current_auth)
    #redirect_to user_subscription_settings_path(current_user, @subscription, anchor: anchor), notice: t("plans.#{action} successful", t_opts) if action
  end

  def calendar
    @subscription = subscription_for(params[:id])
    raise "you can't view a plan's calendar unless you're subscribed" if @subscription.nil?
  end


  private

  def subscription_for( plan )
    Subscription.find(plan, current_auth.user_id, auth: current_auth)
  end

end