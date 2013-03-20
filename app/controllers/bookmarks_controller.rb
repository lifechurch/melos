class BookmarksController < ApplicationController


  # action to display a users bookmarks /users/:user_id/bookmarks
  def index
    @user = User.find(params[:user_id])

    if params[:label]
      @bookmarks = Bookmark.for_label(params[:label], {page: @page, user_id: @user.id})
    else
      @bookmarks = @user.bookmarks(page: @page)
    end
    @labels = Bookmark.labels_for_user(@user.id, page: @labels_page)if Bookmark.labels_for_user(@user.id)
    unless current_user_is?(@user)
      @selected = :bookmarks
      self.sidebar_presenter = Presenter::Sidebar::User.new(@user,params,self)
      render "users/bookmarks", layout: "users"
    end
  end

  def show
    @bookmark = Bookmark.find(params[:id], auth: current_auth)
    raise ActionController::RoutingError.new('Not Found') unless @bookmark
  end

  def new
    if current_auth
      @bookmark = Bookmark.new(params[:bookmark])
    else
      redirect_to bookmarks_path
    end
  end

  def edit
    if current_auth
      @bookmark = Bookmark.find(params[:id], auth: current_auth)
      @bookmark.reference = @bookmark.reference.try :to_usfm
    else
      redirect_to bookmarks_path
    end
  end

  def create
    @bookmark = Bookmark.new(params[:bookmark])
    @bookmark.auth = current_auth

    if @bookmark.save
      return redirect_to bible_path(@bookmark.reference_list.first), notice: t('bookmarks.successfully created')
    else
      render action: "new"
    end
  end

  def update
    params[:bookmark][:highlight_color] = params[:highlight][:color] if params[:highlight]

    @bookmark = Bookmark.find(params[:id], auth: current_auth)
    if @bookmark.update(params[:bookmark])
      #TODO: flash now: notice: t("bookmarks.successfully updated")
      redirect_to bookmarks_path, notice: t("bookmarks.successfully updated")
    else
      render action: "edit"
    end
  end

  def destroy
    @bookmark = Bookmark.find(params[:id], auth: current_auth)

    if @bookmark.destroy
      redirect_to user_bookmarks_path(current_user), notice: t("bookmarks.successfully deleted")
    else
      render action: "index"
      #TODO: add flash error?
    end
  end

  def like
    Like.update(params[:id], current_auth)

    @note = Note.find(params[:id], current_auth)
    render action: "show"
  end

  private

  # Setup required in order to show update since form will post
  # strings instead of the reference / version objects (better way?)
  def set_for_form(note)
    note.reference = Model::hash_to_osis_noversion(note.references)
    note.version = note.version.osis
  end

end
