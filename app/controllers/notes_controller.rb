class NotesController < ApplicationController
  
  def index    
    @notes = Note.all(current_auth)    
  end

  def show
    @note = Note.find(params[:id], current_auth)    
  end

  def new
    @note = Note.new()
  end
        
  def edit
    @note = Note.find(params[:id], current_auth)
    @note.content = @note.content_html

    ref = ''
    @note.reference.each do |reference|
      ref << reference.osis 
    end
    @note.reference = ref
  end

  def create
    @note = Note.new(params[:note])
    @note.auth = current_auth

    if @note.save
      render action: "show"
    else
      render action: "new"
    end    
  end
  
  def update
    @note = Note.find(params[:id], current_auth)
    @note.user = current_user 

    if @note.update_attributes(params[:note])
      render action: "show"
    else
      render action: "edit"
    end
  end
  
  def destroy
    @note = Note.find(params[:id], current_auth)
debugger    
    if @note.destroy
      redirect_to '/'
    else
      render action: "index"
    end
  end
  
end
