class LikesController < ApplicationController

  respond_to :html
  layout "layouts/users"

  def index
    @selected = :likes
    @user     = User.find params[:user_id]
    @likes    = @user.likes(page: params[:page])
    self.sidebar_presenter = Presenter::Sidebar::User.new(@user,params,self)

    #HACK - remove eventually by getting rid of the @me template var in layouts/users.
    @me = current_user_is?(@user)
    respond_with(@likes)
  end

end
