class ReferencesController < ApplicationController
  before_filter :set_nav
  def show
    @html_class = "full_screen" if cookies[:full_screen]
    if !params[:reference]
      flash.keep
      return redirect_to bible_path(last_read || Reference.new(book: "gen", chapter: "1", version: current_version))
    else
      ref_hash = params[:reference].to_osis_hash rescue not_found
      ref_hash[:version] ||= current_version
      ref_hash[:chapter] ||= 1
      if ref_hash.except(:verse) != params[:reference].to_osis_hash.except(:verse)
        flash.keep
        return redirect_to bible_path(Reference.new(ref_hash)) 
      end
    end
    case ref_hash[:verse]
    when Fixnum
      @verses = ref_hash[:verse].to_s
    when Range
      @verses = ref_hash[:verse].to_a.join(",")
    when String
      @verses = ref_hash[:verse].split(",").map do |r|
        case r
        when /^[0-9]+$/
          r
        when /^[0-9-]+$/
          ((r.split("-")[0])..(r.split("-")[1])).to_a.join(",")
        end
      end.flatten.join(",")
      @verses
    end
    @reference = Reference.new(ref_hash.except(:verse))
    @single_verse = Reference.new(ref_hash) if ref_hash[:verse].is_a?(Fixnum)
    @version = Version.find(@reference[:version])
    set_last_read @reference
    set_current_version @version
    notes_ref_hash = ref_hash.dup
    notes_ref_hash[:verse]=1..5
    @note = Note.new
    @notes = Note.for_reference(Reference.new(notes_ref_hash))
    @highlights = current_user ? Highlight.for_reference(@reference, auth: current_auth).to_json : []
    @bookmarks = current_user ? current_user.bookmarks : []
  end

  private

  def set_nav
    @nav = :bible
  end
end
