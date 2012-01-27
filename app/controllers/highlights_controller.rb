class HighlightsController < ApplicationController
  def create
    
    @highlights = params[:highlight][:reference].split(",").map { |r| Highlight.new(params[:highlight].merge(auth: current_auth, reference: r)) }
    if params[:remove]
      debugger
      if @highlights.all?(&:destroy)
        #TODO: handle case of deleting a sub-highlight (verse within a range of verseses already highlighted)?
        redirect_to :back
      else
        redirect_to :back, error: t("highlights.delete error")
        #TODO: log this error for our research
      end
      
    else
      if @highlights.all?(&:save)
        redirect_to :back
      else
        redirect_to :back, error: t("highlights.creation error")
        #TODO: log this error for our research
      end
    end
  end
  #TODO make the sending form submit a different 'delete' form on clicking the clear icon
end
