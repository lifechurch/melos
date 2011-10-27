class ReferencesController < ApplicationController
  def show
    if !params[:reference]
      # look for a last reading position, or just go to default
      return redirect_to bible_path(last_read || Reference.new(book: "gen", chapter: "1", version: current_version))
    else
      ref_hash = params[:reference].to_osis_hash rescue not_found
      ref_hash[:version] ||= current_version
      ref_hash[:chapter] ||= 1
      @reference = Reference.new(ref_hash)
      return redirect_to bible_path(@reference) if @reference.hash != params[:reference].to_osis_hash
    end
    @version = Version.find(@reference[:version])
    puts "lets set some stuff"
    set_last_read @reference
    set_current_version @version
    puts "did i die?"
  end
end
