class RedirectsController < ApplicationController

  before_filter :force_login

  def friends
    redirect_to(user_following_url(current_user))
  end

  def bookmarks
    redirect_to(user_bookmarks_url(current_user))
  end

end