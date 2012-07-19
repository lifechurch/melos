class BookmarksController < ApplicationController
  before_filter :set_nav
  # before_filter :set_sidebar, only: [:index]

  def index
    @user = User.find(params[:user_id], auth: current_auth) # TODO : can't wait to port this to a Resource
    if params[:label]
      @bookmarks = Bookmark.for_label(params[:label], {page: @page, user_id: @user.id})
    else
      @bookmarks = @user.bookmarks(page: @page)
    end
    @labels = Bookmark.labels_for_user(@user.id, page: @labels_page)if Bookmark.labels_for_user(@user.id)
  end

  def show_label
    @user = User.find(params[:user_id], auth: current_auth) # TODO : can't wait to port this to a Resource
    if @user && params[:label]  # API requires both, go figger
      @bookmarks = Bookmark.for_label(params[:label], {user_id: @user.id})
      render template: 'bookmarks/index'
    else
      redirect_to bookmarks_path
    end
  end

  def show
    @bookmark = Bookmark.find(params[:id], auth: current_auth)
    raise ActionController::RoutingError.new('Not Found') unless @bookmark
  end

  def new
    if current_auth
      @bookmark = Bookmark.new
    else
      redirect_to bookmarks_path
    end
  end

  def edit
    if current_auth
      @bookmark = Bookmark.find(params[:id], auth: current_auth)
      @bookmark.reference = @bookmark.reference.to_osis_string if @bookmark.reference.respond_to? :to_osis_string
    else
      redirect_to bookmarks_path
    end
  end

  def create
    @bookmark = Bookmark.new(params[:bookmark])
    @bookmark.auth = current_auth

    if @bookmark.save
      :ruby 
        ref_hash = params[:bookmark][:reference].to_osis_hash
        ref_hash = ref_hash.except(:verse) if ref_hash[:verse].is_a?(Fixnum) #TODO: don't just temporarily avoid modal popup with this hack (get modal: "false" to work below?)
      return redirect_to bible_path(Reference.new(ref_hash), modal: "false"), notice: t('bookmarks.successfully created')
    else
      render action: "new"
    end
  end

  def update
    params[:bookmark][:highlight_color] = params[:highlight][:color] if params[:highlight]

    @bookmark = Bookmark.find(params[:id], auth: current_auth)

    if @bookmark.update(params[:bookmark])
      render action: "index"
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

  def set_nav
    @nav = :bookmarks
  end

  # Set sidebar values for the Likes cell
  def set_sidebar
    @likes = Like.for_user(current_user.id) if current_user
    @user_id = current_user.id if current_user
  end

  # Setup required in order to show update since form will post
  # strings instead of the reference / version objects (better way?)
  def set_for_form(note)
    note.reference = Model::hash_to_osis_noversion(note.references)
    note.version = note.version.osis
  end

end
