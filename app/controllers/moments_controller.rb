class MomentsController < ApplicationController


  before_filter :force_login

  # TODO - optimize before filterage, especially for the #show redirect

  # A logged in users Moments/Home feed
  def index
    @user    = current_user
    @moments = Moment.all(auth: current_auth, page: @page)
  end

  # This is solely to support API action_urls that are formatted /moments/123thisID
  # Lookup the moment and redirect to the appropriate page.
  # TODO - skip any before filters that arent necessary
  def show
    moment = Moment.find(params[:id], auth: current_auth)
    redirect_to moment.path
  end


  # Action meant to render moment cards partial to html for ajax delivery client side
  # Currently being used for next page calls on moments feed.
  def _cards
    @user = current_user
    @moments = Moment.all(auth: current_auth, page: @page)
    render partial: "moments/cards", locals: {moments: @moments}, layout: false
  end


end