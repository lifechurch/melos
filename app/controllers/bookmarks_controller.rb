class BookmarksController < ApplicationController
  before_filter :set_nav
#  before_filter :set_sidebar, :only => [:index]

  def index
    @user = User.find(params[:user_id].to_i, current_auth) # TODO : can't wait to port this to a Resource
    @bookmarks = @user.bookmarks
    @labels = Bookmark.labels_for_user(current_auth.user_id).labels 
  end

  def show_label
    if params[:user_id] && params[:label]  # API requires both, go figger
      @bookmarks = Bookmark.for_label(params[:label], {:user_id => params[:user_id]})
      render :template => 'bookmarks/index'
    else
      redirect_to bookmarks_path
    end
  end

  def show
    @bookmark = Bookmark.find(params[:id], :auth => current_auth)
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
      @bookmark = Bookmark.find(params[:id], :auth => current_auth)
      # @bookmark.reference = @bookmark.reference.to_osis_references
      @bookmark.reference = @bookmark.reference.to_osis_string
    else
      redirect_to bookmarks_path
    end
  end

  def create
    puts "About to create Bookmark from #{params[:bookmark]}"
    if params[:bookmark][:reference].is_a? String
      ref = params[:bookmark][:reference]
      new_ref = ref.to_osis_string
      if ref != new_ref
        Rails.logger.info("Converted ref: #{ref} to this: #{new_ref} so API will like better.")
        params[:bookmark][:reference] = new_ref
      end
    end
    @bookmark = Bookmark.new(params[:bookmark])
    pp @bookmark
    @bookmark.auth = current_auth

    if @bookmark.save
      render action: "show"
    else
      render action: "new"
    end
  end

#YO

  def update
    @note = Note.find(params[:id], :auth => current_auth)

    if @note.update(params[:note])
      render action: "show"
    else
      render action: "edit"
    end
  end

  def destroy
    @note = Note.find(params[:id], :auth => current_auth)

    if @note.destroy
      redirect_to notes_path
    else
      render action: "index"
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
    @likes = Like.all(current_user.id) if current_user
    @user_id = current_user.id if current_user
  end

  # Setup required in order to show update since form will post
  # strings instead of the reference / version objects (better way?)
  def set_for_form(note)
    note.reference = Model::hash_to_osis_noversion(note.references)
    note.version = note.version.osis
  end

end
