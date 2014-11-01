class VodSubscriptionsController < ApplicationController

  layout 'settings'

  before_filter :versions_for_current_language
  before_filter :find_vod_subscription

  def index
   # @devices = current_user.present? ? current_user.devices : User.find(@vod_subscription.user.devices)
   @devices = current_user.devices if current_user.present?
  end

  def create
    params[:hour] = params[:hour].to_i + 12 if params[:meridian] == "PM" and params[:hour].to_i < 12
    params[:hour] = 0 if params[:meridian] == "AM" and params[:hour].to_i == 12
    time = "#{params[:hour]}:#{params[:minute]}:00"
    @vod_subscription = {email: {version_id: nil}, push: {version_id: nil}} if @vod_subscription.errors.present?
    @vod_subscription[params[:type].to_sym] = { time: time, version_id: params[:version_id] }
    params[:token].present? ? @vod_subscription.merge!(token: params[:token]) : @vod_subscription.merge!(auth: current_user.auth)
    @results = VodSubscription.create(@vod_subscription)
    flash[:notice] = t('users.vod_subscription success') unless @results.errors.present?
    flash[:notice] = t('users.vod_subscription failure') if @results.errors.present?
    return redirect_to moments_path if params[:redirect_to] == "moments"
    return redirect_to vod_subscriptions_path
  end

  def destroy
   @vod_subscription[params[:id].to_sym] = { email: {time: nil, version_id: nil} }
   params[:token].present? ? @vod_subscription.merge!(token: params[:token]) : @vod_subscription.merge!(auth: current_user.auth)
   @results = VodSubscription.delete(@vod_subscription)
   flash[:notice] = t('users.vod_subscription success') unless @results.respond_to? :errors
   flash[:notice] = t('users.vod_subscription failure') if @results.respond_to? :errors
   return redirect_to vod_subscriptions_path

  end

  private

  def find_vod_subscription
    @vod_subscription =  params[:token].present? ? VodSubscription.all(token: params[:token]) : VodSubscription.all(auth: current_user.auth)
  end

end