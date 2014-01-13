class NotesController < BaseMomentsController

  # Base moment controller abstractions
    moment_resource "Note"
    moment_comments_display false

  # Filters
    before_filter :set_sidebar, only: [:index]
    before_filter :force_login, only: [:show,:new,:edit,:create,:update,:destroy]

  # TODO: figure out public/friends/private/draft display and authorization
  def show
    @note = current_auth ? Note.find(params[:id], auth: current_auth) : Note.find(params[:id])
    if @note.invalid?
      if @note.has_error?("Note is private")
         redirect_to(notes_path, notice: t("notes.is private")) and return
      
      elsif @note.has_error?("Note not found")
         render_404 unless current_auth # render 404 unless logged in
         @note = Note.find(params[:id]) # logged in, attempt to find the note without auth
      
      elsif @note.has_error?("Note has been reported and is in review")
         @note = Note.find(params[:id], auth: current_auth, force_auth: true)
      end
    end
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


  private

  # Set sidebar values for the Likes cell
  def set_sidebar
    @user_id = current_user.id if current_user
  end

end
