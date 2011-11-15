class ReferencesController < ApplicationController
  before_filter :set_nav
  def show
    if !params[:reference]
      # look for a last reading position, or just go to default
      return redirect_to bible_path(last_read || Reference.new(book: "gen", chapter: "1", version: current_version))
    else
      ref_hash = params[:reference].to_osis_hash rescue not_found
      ref_hash[:version] ||= current_version
      ref_hash[:chapter] ||= 1
      @reference = Reference.new(ref_hash)
      return redirect_to bible_path(@reference) if @reference.raw_hash != params[:reference].to_osis_hash
    end
    @version = Version.find(@reference[:version])
    set_last_read @reference
    set_current_version @version
    notes_ref_hash = ref_hash.dup
    notes_ref_hash[:verse]=1..5
    @notes = Note.for_reference(Reference.new(notes_ref_hash))
  end

  private

  def set_nav
    @nav = :bible
  end
end
