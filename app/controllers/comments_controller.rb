class CommentsController < ApplicationController

  def create
    @comment  = Comment.create({
      moment_id:  params[:comment][:moment_id].to_i,
      content:    params[:comment][:content],
      auth:       current_auth})
    
    if @comment.valid?
       redirect_to(:back, notice: "Saved")
    else
       redirect_to(:back, notice: "Error")
    end
  end

end