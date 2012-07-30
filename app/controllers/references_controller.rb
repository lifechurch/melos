class ReferencesController < ApplicationController
  before_filter :set_nav
  rescue_from InvalidReferenceError, with: :ref_not_found

  def show
    # Set HTML classes for full screen/parallel
    cookies[:full_screen] ||= 1 if params[:full_screen]
    @html_classes = []
    @html_classes << "full_screen" if cookies[:full_screen]
    @html_classes << "full_screen" << "parallel_mode" if cookies[:parallel_mode]
    # Get user font and size settings
    @font = cookies['data-setting-font']
    @size = cookies['data-setting-size']

    # Redirect if it's anything other than book.chapter.version, ignoring verses for now
    if !params[:reference]
      flash.keep
      return redirect_to bible_path(last_read || Reference.new(book: "john", chapter: "1", version: current_version))
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

    # If the reference was a single verse, set that up so we can display the modal
    if ref_hash[:verse].is_a?(Fixnum) && (external_request? || params[:modal] == "true") && params[:modal] != "false"
      @single_verse = Reference.new(ref_hash)
    end

    # Create an empty note for the note sidebar widget
    @note = Note.new

    # Set up user specific stuff
    @highlight_colors = User.highlight_colors

    # Set up parallel mode stuff -- if it fails, we're at the end so the other values are populated
    @alt_version = Version.find(alt_version(@reference))
    @alt_reference = Reference.new(@reference.raw_hash.except(:version), @alt_version.osis)

  end

  def highlights
      @highlights = Highlight.for_reference(Reference.new(params[:reference]), auth: current_auth) if current_auth
      @highlights = [] if @highlights.nil?
      render json: @highlights
  end

  def notes
    # Set up a fake reference for the fist 5 verses since the API won't let us
    # search the entire chapter for notes and 10 results in a param length API err
    notes_ref_hash = params[:reference].to_osis_hash rescue not_found
    notes_ref_hash[:verse]=1..5 unless notes_ref_hash[:verse]
    @notes = Note.for_reference(Reference.new(notes_ref_hash), language_iso: I18n.locale, cache_for: 10.minutes)
    @notes = Note.for_reference(Reference.new(notes_ref_hash), cache_for: 10.minutes) if @notes.empty?
    render layout: false
  end

  def bookmarks
    @bookmarks = Bookmark.for_user(current_auth.user_id)
    render '/shared/_widget_bookmarks', layout: false
  end


  private

  def set_nav
    @nav = :bible
  end

  protected
    def ref_not_found(ex)
      if ex.is_a? BadSecondaryVersionError
        @alt_version = Version.find(cookies[:alt_version])
        @alt_reference = Hashie::Mash.new({contents: ["<h1>#{t('ref.invalid chapter title')}</h1>","<p>#{t('ref.invalid chapter text')}</p>"]})
        return render :show if @reference.valid?
      end

      if ex.is_a? NoSecondaryVersionError
        @alt_version = @version
        @alt_reference = Hashie::Mash.new({contents: ["<h1>#{t('ref.no secondary version title')}</h1>","<p>#{t('ref.no secondary version text', language_name: t('language name'))}</p>"]})
        return render :show if @reference.valid?
      end

      #we don't need to report these types of 404's as long as we have the right redirects.
      #report_exception(ex)

      #force to be in non-parallel/fullscreen mode for Ref_not_found
      @html_classes.delete "full_screen" and cookies[:full_screen] = nil
      @html_classes.delete "parallel_mode" and cookies[:parallel_mode] = nil

      osis_hash = params[:reference].to_osis_hash rescue nil
      @alt_reference = @reference = Reference.new(osis_hash.except(:version)) rescue nil
      @alt_reference = @reference = Reference.new(book: "john", chapter: "1") if @reference.nil? || !@reference.valid?

      @version = Version.find(osis_hash[:version]) rescue Version.find(Version.default_for(I18n.locale))
      @alt_version ||= @version

      render :invalid_ref, status: 404
    end
end
