class VodSubscriptionsController < ApplicationController

  layout 'settings'

  before_filter :find_versions
  before_filter :find_vod_subscription

  def index
    @devices = current_user.devices
  end

  def create

    params[:hour] = params[:hour].to_i + 12 if params[:meridian] == "PM"
    time = "#{params[:hour]}:#{params[:minute]}:00"
    @vod_subscription[params[:type].to_sym] = { time: time, version_id: params[:version_id] }
    @results = VodSubscription.create(@vod_subscription.merge(auth: current_user.auth))
    return redirect_to user_vod_subscriptions_path
  end

  def destroy
   @vod_subscription[params[:id].to_sym] = { email: {time: nil, version_id: nil} }
   @results = VodSubscription.delete(@vod_subscription.merge(auth: current_user.auth))
   return redirect_to user_vod_subscriptions_path(user_id: current_user.username)

  end

  private

  def find_vod_subscription
    @vod_subscription = VodSubscription.all(auth: current_user.auth)
  end

  def find_versions    
    primary_locale = Version.find(params[:context_version]).language.tag rescue nil if params[:context_version].present?
    primary_locale ||= I18n.locale.to_s
    primary_locale = "en" if primary_locale == "en-GB" #TODO fix.this.hack
    @versions_by_lang = Version.by_language({:only => primary_locale})
  end

end