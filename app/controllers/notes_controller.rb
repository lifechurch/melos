class NotesController < ApplicationController
  
  def index    
    @notes = Note.all(current_auth)    
  end

  def show
    @note = Note.find(params[:id], current_auth)    
  end

  def new
    @note = Note.new()
    @url_path = notes_path
    @url_method = :post
  end
        
  def edit
    @note = Note.find(params[:id], current_auth)
    @note.content = @note.content_html
    @url_path = notes_path << '/' << params[:id]
    @url_method = :put

    ref = ''
    @note.reference.each do |reference|
      ref << reference.osis 
    end
    @note.reference = ref
  end

  def create
    @note = Note.new(params[:note])
    @note.auth = current_auth

    if @note = @note.save
      render action: "show"
    else
      render action: "new"
    end    
  end
  
  def update
    @note = Note.find(params[:id], current_auth)
    #@note.user = current_user 

    if @note = @note.save_attributes(params[:note])
      render action: "show"
    else
      render action: "edit"
    end
  end
  
  def destroy
    @note = Note.find(params[:id], current_auth)
    
    if @note.destroy
      redirect_to notes_path
    else
      render action: "index"
    end
  end
  
end
