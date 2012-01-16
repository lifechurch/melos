class HighlightsController < ApplicationController
  def create
    @highlight = Highlight.new(params[:highlight].merge(auth: current_auth))
    if @highlight.save
      redirect_to :back, notice: "Your highlight was created!"
    else
      redirect_to :back, error: "Sorry, couldn't highlight."
    end
  end

  def destroy
  end
end
