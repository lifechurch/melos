class LikesController < ApplicationController
  before_filter :set_nav

  def index
    if params[:user_id]
      @likes = Like.for_user(params[:user_id])
    else
      @likes = Like.for_user(current_user.id) #TODO: Remove User ID once the likes and notes are sync'd
    end
  end

  private

  def set_nav
    @nav = :notes
  end
end
