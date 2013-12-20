class AvatarsController < ApplicationController

  before_filter :force_login

  def show
    @user = current_user
    @user_avatar_urls = @user.user_avatar_url
  end

  def update
    @user = current_user
    @results = @user.update_picture(params[:user].try(:[], :image))
    
    if @results.valid?
      redirect_to(user_avatar_path(@user), notice: t('users.profile.updated picture'))
    else
      @user_avatar_urls = @user.user_avatar_url
      render action: "show"
    end
  end

end