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
    render partial: 'sidebars/notes/index'
  end


  # Rendered as sidebar for Community Notes in Reader
  # See routes.rb: match 'bible/:version/:reference/notes' => 'notes#sidebar', :constraints => {:version => /[^\/\.]*/, :reference => /[^\/]*/}
  def sidebar
    ref    = ref_from_params rescue not_found
    notes  = Note.community({usfm: ref_to_usfm_array(ref), version_id: params[:version], page: @page})
    next_cursor = notes.next_cursor
    start = (@page - 1) * 5
    notes = notes.slice(start, 5)
    render partial: 'sidebars/notes/list', locals: {notes: notes, ref: ref, next_cursor: next_cursor}, layout: false
  end


  private

  # API only allows references with verses (JHN.1.1) not just a single chapter (JHN.1)
  # Used to add verses to a chapter reference so we can display results on a chapter reader page.
  def ref_to_usfm_array(ref)
    if ref.chapter?
      _usfm = ref.usfm
      (1..5).collect {|num| "#{_usfm}.#{num}" }  
    else
      ref.usfm.split("+")
    end
  end

  # Set sidebar values for the Likes cell
  def set_sidebar
    @user_id = current_user.id if current_user
  end

end
