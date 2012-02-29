class BadgesController < ApplicationController
  before_filter :find_user
  
  def show
    @badge = @user.find_badge(params[:id])
  end

  private

  def find_user
    @user = User.find(params[:user_id], auth: current_auth)
  end

end
