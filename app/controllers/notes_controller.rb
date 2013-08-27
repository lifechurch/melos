class NotesController < ApplicationController
  before_filter :set_nav
  before_filter :set_sidebar, :only => [:index]

  def index
      @notes = Note.all(language_tag: I18n.locale, cache_for: YV::Caching.a_very_short_time)
      # drop language tag filter if no notes found
      @notes = Note.all(cache_for: YV::Caching.a_very_short_time) if @notes.empty?
      self.sidebar_presenter = Presenter::Sidebar::Notes.new
  end

  def related
    #API Constraint to be put in model eventually
    page = params[:page] || 1
    ref = ref_from_params rescue not_found
    @notes = Note.for_reference(ref, language_tag: I18n.locale, page: page, cache_for: YV::Caching.a_short_time)
    @notes = Note.for_reference(ref, page:page, cache_for: YV::Caching.a_short_time) if @notes.empty?
    @reference_title = ref.human
    render template:"notes/index"
  end

  def show
    begin
      @note = current_auth ? Note.find(params[:id], auth: current_auth) : Note.find(params[:id])
      
    rescue YV::ResourceError => e
      if e.has_error?("Note is private")
        redirect_to(notes_path, notice: t("notes.is private")) and return
      elsif e.has_error?("Note not found")
        render_404 unless current_auth # render 404 unless logged in
        @note = Note.find(params[:id]) # logged in, attempt to find the note without auth
      elsif e.has_error?("Note has been reported and is in review")
        @note = Note.find(params[:id], :auth => current_auth, :force_auth => true)
      else
        raise(e)
      end
    end
  end

  def new
    if current_auth
      @note = Note.new(params[:note])
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
    @note.auth = current_auth

    if @note.save
      redirect_to note_path(@note.id)
    else
      render action: "new"
    end
  end

  def update
    @note = Note.find(params[:id], :auth => current_auth)
    @note.update(params[:note]) ? redirect_to(note_path(@note)) : render(action: "edit")
  end

  def destroy
    @note = Note.find(params[:id], :auth => current_auth)

    if @note.destroy
      redirect_to user_notes_path(current_auth.username), notice: t("notes.successfully deleted")
    else
      render action: "index"
    end
  end

  private

  def set_nav
    @nav = :notes
  end

  # Set sidebar values for the Likes cell
  def set_sidebar
    @user_id = current_user.id if current_user
  end

  # Setup required in order to show update since form will post
  # strings instead of the reference / version objects (better way?)
  def set_for_form(note)
    note.reference = Model::hash_to_osis_noversion(note.references)
    note.version = note.version.id
  end

end
