class HighlightsController < ApplicationController



  def create
    #Parameters: {"highlight"=>{"references"=>"gen.1.1.asv,gen.1.6.asv,gen.1.7.asv", "ids"=>"79,98,-1", "color"=>"861eba"}}
    @highlights = params[:highlight][:references].split(",").uniq.map { |r| Highlight.new(Hashie::Mash.new(params[:highlight].merge(auth: current_auth, reference: r))) }
    existing = []
    params[:highlight][:existing_ids].split(",").uniq.each {|id| existing << Highlight.new(Hashie::Mash.new({auth: current_auth, id: id})) if id.to_i >= 0} # only need id and auth to destroy

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

  # Non standard Rails actions.
  # ------------------------------------------------------------

  def for_reference
    highlights = Highlight.for_reference(ref_from_params, auth: current_auth) if current_auth
    highlights ||= []
    render json: highlights
  end


  # TODO: turn this into a json action and render the html client side.
  # Endpoint returns a list of default colors *or* colors scoped to the current_user
  def colors
    render partial: "colors",
           layout: false,
           locals: {colors: Highlight.colors(auth: (current_auth rescue nil)).slice(0,10)}
  end

end