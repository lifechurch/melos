class ReferencesController < ApplicationController
  def show
    ref_hash = params[:reference].to_osis_hash rescue not_found
    ref_hash[:version] ||= current_user.version ||= Version.default
    @reference = Reference.new(ref_hash)
    @version = Version.new(ref_hash[:version])
  end
end
