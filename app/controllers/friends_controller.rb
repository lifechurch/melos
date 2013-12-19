class FriendsController < ApplicationController

  # Using user layout as this is a nested resource on a user
    layout "users"
  
  # Should be authenticated 
    before_filter :force_login

  # GET "/users/:user_id/friends"
  def index
    @user  = User.find(params[:user_id])
    @friends = Friend.all(page: @page, user_id: @user.id.to_i, auth: current_auth)
  end

  def destroy
    result = Friend.delete(user_id: params[:id], auth: current_auth)
    notice = result.valid? ? "Friend removed" : "Error removing friend"
    redirect_to(:back, notice: notice )
  end


  def _list
    @user  = User.find(params[:user_id])
    @friends = Friend.all(page: @page, user_id: @user.id.to_i, auth: current_auth)
    render partial: "friends/list", locals: {friends: @friends, user: @user}, layout: false
  end

end