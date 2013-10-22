class CommentsController < ApplicationController

  def create
    @comment = Comment.create(params[:comment].merge(auth: current_auth))
    
    if @comment.valid?
       redirect_to(:back, notice: "Saved")
    else
       redirect_to(:back, notice: "Error")
    end
  end

end