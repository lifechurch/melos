# TODO, skip all appropriate before filters.

class LikesController < ApplicationController

  respond_to :js

  before_filter :force_login

  def create
    @like = Like.create({moment_id: params[:moment_id].to_i, auth: current_auth})

    respond_to do |format|
      format.html {
        notice = @comment.valid? ? t("likes.create success") : t("likes.create failure")
        redirect_to(:back, notice: notice)
      }
      format.js {} #renders create.js.rabl
    end
    
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
    respond_to do |format|
      format.html {
        notice = results.valid? ? t("likes.destroy success") : t("likes.destroy failure")
        redirect_to(:back, notice: notice)
      }
      format.js { 
        render text: "", status: results.valid? ? 200 : 400
      }
    end
  end


end