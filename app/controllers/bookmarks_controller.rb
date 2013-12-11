class BookmarksController < ApplicationController

  before_filter :force_login

  # Action meant to render moment cards partial to html for ajax delivery client side
  # Currently being used for next page calls on moments feed.
  def _cards
    @user = User.find(params[:user_id])
    @moments = Bookmark.all(auth: current_auth, page: @page)
    render partial: "moments/cards", locals: {moments: @moments, comments_displayed: false}, layout: false
  end

  def show
    @bookmark = Bookmark.find(params[:id], auth: current_auth)
    raise ActionController::RoutingError.new('Not Found') unless @bookmark
  end

  def create
    @bookmark = Bookmark.new(params[:bookmark])
    @bookmark.auth = current_auth

    results = @bookmark.save
    results.valid? ? redirect_to(:back, notice: t('bookmarks.create success')) : render(action: "new")
  end

  def edit
    @bookmark = Bookmark.find(params[:id], auth: current_auth)
    redirect_to(moments_path) and return unless @bookmark.user_id == current_auth.user_id
  end

  def update
    @bookmark = Bookmark.find(params[:id], auth: current_auth)
    redirect_to(moments_path) and return unless @bookmark.user_id == current_auth.user_id
    
    @bookmark.auth = current_auth
    params[:bookmark][:color] = params[:highlight][:color] if params[:highlight]
    results = @bookmark.update(params[:bookmark])
    results.valid? ? redirect_to(:back, notice: t("bookmarks.update success")) : render(action: "edit")
  end

  def destroy
    @bookmark = Bookmark.find(params[:id], auth: current_auth)
    redirect_to(moments_path) and return unless @bookmark.user_id == current_auth.user_id
    
    @bookmark.auth = current_auth
    results = @bookmark.destroy
    notice = results.valid? ? t("bookmarks.destroy success") : t("bookmarks.destroy failure")
    redirect_to(:back, notice: notice)
  end

end
