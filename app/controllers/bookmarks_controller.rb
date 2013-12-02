class BookmarksController < ApplicationController

  def show
    @bookmark = Bookmark.find(params[:id], auth: current_auth)
    raise ActionController::RoutingError.new('Not Found') unless @bookmark
  end

  def edit
    redirect_to(bookmarks_path) unless current_auth
    @bookmark = Bookmark.find(params[:id], auth: current_auth)
  end

  def create
    @bookmark = Bookmark.new(params[:bookmark])
    @bookmark.auth = current_auth

    results = @bookmark.save
    results.valid? ? redirect_to(:back, notice: t('bookmarks.successfully created')) : render(action: "new")
  end

  def update
    params[:bookmark][:color] = params[:highlight][:color] if params[:highlight]

    @bookmark = Bookmark.find(params[:id], auth: current_auth)
    @bookmark.auth = current_auth

    results = @bookmark.update(params[:bookmark])
    results.valid? ? redirect_to(:back, notice: t("bookmarks.successfully updated")) : render(action: "edit")
  end

  def destroy
    @bookmark = Bookmark.find(params[:id], auth: current_auth)
    @bookmark.auth = current_auth
    
    results = @bookmark.destroy
    results.valid? ? redirect_to(user_bookmarks_path(current_user), notice: t("bookmarks.successfully deleted")) : render(action: "index")
  end

end
