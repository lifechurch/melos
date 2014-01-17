class CommentsController < ApplicationController

  respond_to :html, :js

  before_filter :force_login

  def create
    @comment  = Comment.create({
      moment_id:  params[:comment][:moment_id].to_i,
      content:    params[:comment][:content],
      auth:       current_auth})

    respond_to do |format|
      format.html {
        notice = @comment.valid? ? t("comments.create success") : t("comments.create failure")
        redirect_to(:back, notice: notice)    
      }
      format.js {} #renders create.js.rabl
    end
    
  end

end