class HighlightsController < BaseMomentsController

  # Base moment controller abstractions
    moment_resource "Highlight"
    moment_comments_display false

  # Filters
    before_filter :force_login, except: [:colors]

  def show
    @highlight = Highlight.find(params[:id], auth: current_auth)
  end

  # TODO: turn this into a json action and render the html client side.
  # Endpoint returns a list of default colors *or* colors scoped to the current_user
  def colors
    render partial: "colors",
           layout: false,
           locals: {colors: Highlight.colors(auth: (current_auth rescue nil)).slice(0,10)}
  end


  # Kept temporarily for historical reference
  #def create

    #Parameters: {"highlight"=>{"references"=>"gen.1.1.asv,gen.1.6.asv,gen.1.7.asv", "existing_ids"=>"79,98,-1", "color"=>"861eba"}}
    #references    = params[:highlight].delete(:references)
    #existing_ids  = params[:highlight].delete(:existing_ids)

    #existing_highlights = existing_ids.split(",").uniq.map {|id| Highlight.new(auth: current_auth, id: id) if id.to_i >= 0} # only need id and auth to destroy
    #highlights          = references.split(",").uniq.map   {|rf| Highlight.new(auth: current_auth, reference: rf, color: params[:highlight][:color]) }

    #if params[:remove]
    #  if existing_highlights.all?(&:destroy)
    #    redirect_to :back
    #  else
    #    redirect_to :back, error: t("highlights.delete error")
    #  end
    #else #user is creating highlights
    #  if existing_highlights.all?(&:destroy) && highlights.all?(&:save)
    #    redirect_to :back
    #  else
    #    redirect_to :back, error: t("highlights.creation error")
    #  end
    #end
  #end

end
