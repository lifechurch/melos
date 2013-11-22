class MomentsController < ApplicationController

  def index
    @user    = current_user
    @moments = Moment.all(auth: current_auth, page: @page)
  end


  def _cards
    @user = current_user
    @moments = Moment.all(auth: current_auth, page: @page)
    render partial: "moments/cards", locals: {moments: @moments}, layout: false
  end


end