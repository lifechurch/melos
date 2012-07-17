class HighlightsController < ApplicationController
  def create
    #Parameters: {"highlight"=>{"references"=>"gen.1.1.asv,gen.1.6.asv,gen.1.7.asv", "ids"=>"79,98,-1", "color"=>"861eba"}}
    @highlights = params[:highlight][:references].split(",").map { |r| Highlight.new(Hashie::Mash.new(params[:highlight].merge(auth: current_auth, reference: r))) }
    existing = []
    params[:highlight][:existing_ids].split(",").each {|id| existing << Highlight.new(Hashie::Mash.new({auth: current_auth, id: id})) if id.to_i >= 0} # only need id and auth to destroy
    params[:highlight][:existing_ids].split(",").each {|id| existing << Highlight.new(Hashie::Mash.new({auth: current_auth, id: id})) if id.to_i >= 0} # only need id and auth to destroy

    if params[:remove]
      if existing.all?(&:destroy)
        redirect_to :back
      else
        redirect_to :back, error: t("highlights.delete error")
        #TODO: log this error for our research
      end
    else #user is creating highlights

      if existing.all?(&:destroy) && @highlights.all?(&:save)
        redirect_to :back
      else
        redirect_to :back, error: t("highlights.creation error")
        #TODO: log this error for our research
      end
    end
  end
  #TODO make the sending form submit a different 'delete' form on clicking the clear icon
end
