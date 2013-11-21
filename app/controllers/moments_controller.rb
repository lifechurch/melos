class MomentsController < ApplicationController


  def cards
    @user = current_user
    @moments = Moment.all(auth: current_auth, page: @page)
    render partial: "moments/cards", locals: {moments: @moments}, layout: false
  end


end