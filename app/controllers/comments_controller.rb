class CommentsController < ApplicationController

  before_filter :force_login

  def create
    @comment  = Comment.create({
      moment_id:  params[:comment][:moment_id].to_i,
      content:    params[:comment][:content],
      auth:       current_auth})
    
    notice = @comment.valid? ? "Saved" : "Error"
    redirect_to(:back, notice: notice)
  end

end