class BadgesController < ApplicationController

  respond_to :html

  def show
    @user = User.find(params[:user_id], auth: current_auth)
    @badge = @user.find_badge(params[:id])
    respond_with(@badge)
  end

end
