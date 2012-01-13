class HighlightsController < ApplicationController
  def create
    @highlight = Highlight.new(params[:highlight], auth: current_auth)
  end

  def destroy
  end
end
