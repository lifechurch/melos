class LikesController < ApplicationController
  before_filter :set_nav

  def index
    @likes = Like.all(current_user.id)
  end

  private

  def set_nav
    @nav = :notes
  end
end
