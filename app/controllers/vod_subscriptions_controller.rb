class VodSubscriptionsController < ApplicationController

  layout 'settings'

  before_filter :versions_for_current_language
  before_filter :find_vod_subscription

  def index
    @devices = current_user.devices
  end

  def create
    params[:hour] = params[:hour].to_i + 12 if params[:meridian] == "PM"
    time = "#{params[:hour]}:#{params[:minute]}:00"
    @vod_subscription[params[:type].to_sym] = { time: time, version_id: params[:version_id] }
    @results = VodSubscription.create(@vod_subscription.merge(auth: current_user.auth))
    flash[:notice] = t('users.vod_subscription success') unless @results.errors.present?
    return redirect_to moments_path if params[:redirect_to] == "moments"
    return redirect_to user_vod_subscriptions_path
  end

  def destroy
   @vod_subscription[params[:id].to_sym] = { email: {time: nil, version_id: nil} }
   @results = VodSubscription.delete(@vod_subscription.merge(auth: current_user.auth))
   flash[:notice] = t('users.vod_subscription success')
   return redirect_to user_vod_subscriptions_path(user_id: current_user.username)

  end

  private

  def find_vod_subscription
    @vod_subscription = VodSubscription.all(auth: current_user.auth)
  end

end