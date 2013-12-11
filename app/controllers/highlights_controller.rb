class HighlightsController < ApplicationController

  before_filter :force_login, except: [:colors]


  # Action meant to render moment cards partial to html for ajax delivery client side
  # Currently being used for next page calls on moments feed.
  def _cards
    @user = User.find(params[:user_id])
    @moments = Highlight.all(auth: current_auth, page: @page)
    render partial: "moments/cards", locals: {moments: @moments, comments_displayed: false}, layout: false
  end

  def show
    @highlight = Highlight.find(params[:id], auth: current_auth)
  end


  def create

    @highlight = Highlight.new(params[:highlight])
    @highlight.auth = current_auth

    result = @highlight.save
    notice = result.valid? ? t("highlights.create success") : t("highlights.create failure")
    redirect_to(:back, notice: notice)

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
  end

  def destroy
    @highlight = Highlight.find(params[:id], auth: current_auth)
    redirect_to(moments_path) and return unless @highlight.user_id == current_auth.user_id
    
    @highlight.auth = current_auth
    results = @highlight.destroy
    notice = results.valid? ? t("highlights.destroy success") : t("highlights.destroy failure")
    redirect_to(:back, notice: notice)
  end

  # TODO: turn this into a json action and render the html client side.
  # Endpoint returns a list of default colors *or* colors scoped to the current_user
  def colors
    render partial: "colors",
           layout: false,
           locals: {colors: Highlight.colors(auth: (current_auth rescue nil))}
  end

end