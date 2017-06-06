# TODO, skip all appropriate before filters.

class LikesController < ApplicationController

  respond_to :js

  before_filter :force_login

  def create
    @like = Like.create({moment_id: params[:moment_id].to_i, auth: current_auth})
    respond_with @like
  end


  # Bit of a REST hack
  # params[:id] is the ID of the moment, not the id of the Like
  # compromise with how API returns us data.

  def destroy
    results = Like.delete({
      moment_id: params[:id].to_i,
      user_id: current_auth.user_id,
      auth: current_auth
    })
    render text: "", status: results.valid? ? 200 : 400
  end
end