class FriendshipsController < ApplicationController
  before_filter :mobile_redirect, only: [:requests]
  respond_to :html, :json

  before_filter :force_login

  def requests
    @friendships = Friendships.incoming(page: @page, auth: current_auth)
    respond_with(@friendships)
  end

  # Accept a friendship
  def create
    @friendship = Friendships.accept(request_opts(params[:user_id]))
    redirect_to(:back, notice: select_notice(@friendship, :create))
    # eventually support json/ajax submission for javascript menus, etc.
    #respond_with(@friendship)
  end

  def offer
    @friendship = Friendships.offer(request_opts(params[:user_id]))
    redirect_to(:back, notice: select_notice(@friendship,:offer))
  end

  # Decline
  # This is a bit hackish with regards to Rails REST best practices
  # DELETE /friendships/:id
  # params[:id] is not the id(pk) of a server side Friendship
  # params[:id] is being used as a user_id in this particular scenario
  def destroy
    @friendship = Friendships.decline(request_opts(params[:id]))
    redirect_to(:back, notice: select_notice(@friendship,:destroy))
  end

  private

  def request_opts(id)
    {user_id: id.to_i, auth: current_auth}
  end

  def select_notice( friendship , api_method )
    raise "Invalid i18n key" unless [:create,:offer,:destroy].include? api_method
    friendship.valid? ? t("friendships.#{api_method.to_s} success") : t("friendships.#{api_method.to_s} failure")
  end

end