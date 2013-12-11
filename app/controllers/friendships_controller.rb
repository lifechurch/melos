class FriendshipsController < ApplicationController

  respond_to :html, :json

  before_filter :force_login

  def requests
    @friendships = Friendships.incoming(page: @page, auth: current_auth)
    respond_with(@friendships)
  end

  # Accept a friendship
  def create
    @friendship = Friendships.accept(user_id: params[:user_id].to_i, auth: current_auth)
    notice = @friendship.valid? ? t("friendships.create success") : t("friendships.create failure")
    redirect_to(:back, notice: notice)
    # eventually support json/ajax submission for javascript menus, etc.
    #respond_with(@friendship)
  end

  def offer
    @friendship = Friendships.offer(user_id: params[:user_id].to_i, auth: current_auth)
    notice = @friendship.valid? ? t("friendships.offer success") : t("friendships.offer failure")
    redirect_to(:back, notice: notice)
  end

  # Decline
  # This is a bit hackish with regards to Rails REST best practices
  # DELETE /friendships/:id
  # params[:id] is not the id(pk) of a server side Friendship
  # params[:id] is being used as a user_id in this particular scenario
  def destroy
    @friendship = Friendships.decline(user_id: params[:id].to_i, auth: current_auth)
    notice = @friendship.valid? ? t("friendships.destroy success") : t("friendships.destroy failure")
    redirect_to(:back, notice: notice)
  end

end