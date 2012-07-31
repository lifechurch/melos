class NotesController < ApplicationController
  before_filter :set_nav
  before_filter :set_sidebar, :only => [:index]

  def index
      @notes = Note.all(language_iso: I18n.locale, cache_for: 2.minutes)
      # drop language tag filter if no notes found
      @notes = Note.all(cache_for: 2.minutes) if @notes.empty?
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
    else
      redirect_to notes_path
    end
  end

  def create
    @note = Note.new(params[:note])
    Rails.logger.debug "note is:"
    Rails.logger.debug @note.inspect
    @note.auth = current_auth

    if @note.save
      Rails.logger.debug "now note is:"
      Rails.logger.debug @note.inspect
      redirect_to note_path(@note.id)
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
      redirect_to notes_path, notice: t("notes.successfully deleted")
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
    note.version = note.version.id
  end

end
