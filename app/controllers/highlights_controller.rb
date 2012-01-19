class HighlightsController < ApplicationController
  def create
    @highlight = Highlight.new(params[:highlight].merge(auth: current_auth))
    @highlights = params[:highlight][:reference].split(",").map { |r| Highlight.new(params[:highlight].merge(auth: current_auth, reference: r)) }
    if @highlights.all?(&:save)
      redirect_to :back, notice: "Your highlight was created!"
    else
      redirect_to :back, error: "Sorry, couldn't highlight."
    end
  end

  def destroy
  end
end
