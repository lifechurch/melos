class NotesController < ApplicationController
  before_filter :set_nav
  before_filter :set_sidebar, :only => [:index]

  def index
    if params[:user_id] || current_auth
      redirect_to user_notes_path(params[:user_id] || current_user) and return
    else
      @selected = :notes
      @notes = Note.all(page: @page)
    end
  end

  def show
    @note = Note.find(params[:id], :auth => current_auth)
    raise ActionController::RoutingError.new('Not Found') unless @note
  end

  def new
    if current_auth
      @note = Note.new
    else
      redirect_to notes_path
    end
  end

  def edit
    if current_auth
      @note = Note.find(params[:id], auth: current_auth)
      #@note.reference = @note.reference_list.to_osis_references
    else
      redirect_to notes_path
    end
  end

  def create
    debugger
    @note = Note.new(params[:note])
    @note.auth = current_auth

    if @note.save
      redirect_to @note
    else
      render action: "new"
    end
  end

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
    @nav = :notes
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
