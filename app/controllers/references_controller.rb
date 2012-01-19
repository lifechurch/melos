class ReferencesController < ApplicationController
  before_filter :set_nav
  def show
    @html_class = "full_screen" if cookies[:full_screen]
    if !params[:reference]
      flash.keep
      return redirect_to bible_path(last_read || Reference.new(book: "gen", chapter: "1", version: current_version))
    else
      puts "!@# params reference is #{params[:reference]}"
      ref_hash = params[:reference].to_osis_hash rescue not_found
      puts "!@# ref_hash is #{ref_hash}"
      ref_hash[:version] ||= current_version
      ref_hash[:chapter] ||= 1
      flash.keep
      return redirect_to bible_path(Reference.new(ref_hash)) if ref_hash.except(:verse) != params[:reference].to_osis_hash.except(:verse)
    end
    case ref_hash[:verse]
    when Fixnum
      puts "!@# in fixnum"
      @verses = ref_hash[:verse].to_s
    when Range
      puts "!@# in range"
      @verses = ref_hash[:verse].to_a.join(",")
    when String
      puts "!@# in string"
      @verses = ref_hash[:verse].split(",").map do |r|
        puts "hey, r is #{r}"
        case r
        when /^[0-9]+$/
          r
        when /^[0-9-]+$/
          ((r.split("-")[0])..(r.split("-")[1])).to_a.join(",")
        end
      end.flatten.join(",")
      puts "verses is now #{@verses}"
      @verses
    end
    @reference = Reference.new(ref_hash.except(:verse))
    puts "!@# @references is #{@reference}"
    @version = Version.find(@reference[:version])
    set_last_read @reference
    set_current_version @version
    notes_ref_hash = ref_hash.dup
    notes_ref_hash[:verse]=1..5
    @notes = Note.for_reference(Reference.new(notes_ref_hash))
    @highlights = current_user ? Highlight.for_reference(@reference, auth: current_auth).to_json : []
    @bookmarks = current_user ? current_user.bookmarks : []
  end

  private

  def set_nav
    @nav = :bible
  end
end
