class ReferencesController < ApplicationController
  before_filter :set_nav
  rescue_from NotAChapterError, :with => :ref_not_found
  
  def show
    # Set HTML classes for full screen/parallel
    @html_classes = []
    @html_classes << "full_screen" if cookies[:full_screen]
    @html_classes << ["full_screen", "parallel_mode"] if cookies[:parallel_mode]
    
    # Redirect if it's anything other than book.chapter.version, ignoring verses for now
    if !params[:reference]
      flash.keep
      return redirect_to bible_path(last_read || Reference.new(book: "gen", chapter: "1", version: current_version))
      #TODO: What if gen.1 doesn't exist for current_version? OK with 'this doesn't exist, select another' view?
    else
      ref_hash = params[:reference].to_osis_hash rescue not_found
      ref_hash[:version] ||= current_version
      ref_hash[:chapter] ||= 1
      if ref_hash.except(:verse) != params[:reference].to_osis_hash.except(:verse)
        flash.keep
        return redirect_to bible_path(Reference.new(ref_hash)) 
      end
    end

    # Hang on to verses to select them in the reader
    @verses = Reference.new(ref_hash).verses_string

    # Set the canonical reference for the page to the entire chapter
    @reference = Reference.new(ref_hash.except(:verse))
    @version = Version.find(@reference[:version])

    # Set cookies to save this as the user's current version and reference
    set_current_version @version
    set_last_read @reference

    # Set up parallel mode
    @alt_reference = (alt_version == current_version) ? @reference : Reference.new(@reference.raw_hash.except(:version), alt_version)

    # If the reference was a single verse, set that up so we can display the modal
    if ref_hash[:verse].is_a?(Fixnum)
      @single_verse = Reference.new(ref_hash) unless params[:modal] == "false"
    end

    # Set up a fake reference for the fist 5 verses since the API won't let us
    # search the entire chapter for notes
    notes_ref_hash = ref_hash.dup
    notes_ref_hash[:verse]=1..5
    @notes = Note.for_reference(Reference.new(notes_ref_hash), cache_for: 30.minutes)

    # Create an empty note for the note sidebar widget
    @note = Note.new

    # Set up user specific stuff
    if current_user
      @highlights = Highlight.for_reference(@reference, auth: current_auth)
      @alt_highlights = Highlight.for_reference(@alt_reference, auth: current_auth)
      @highlight_colors = current_user.highlight_colors
      @bookmarks = current_user.bookmarks
    else
      @highlights = []
      @alt_highlights = []
      @highlight_colors = User.highlight_colors
      @bookmarks = []
    end
  end

  private

  def set_nav
    @nav = :bible
  end
  
  protected
    def ref_not_found(ex)
      osis_hash = params[:reference].to_osis_hash
      @alt_reference = @reference = Reference.new(osis_hash.except(:version))
      @version = Version.find(osis_hash[:version])
      render :invalid_ref
    end
end
