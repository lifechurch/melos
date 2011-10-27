class NotesController < ApplicationController
  
  def index    
    @notes = Note.all(current_auth.id, current_auth)    
  end

  def show
    @note = Note.find(params[:id], current_auth)
    raise ActionController::RoutingError.new('Not Found') unless @note
  end

  def new
    @note = Note.new()
    #@url_path = notes_path
    #@url_method = :post
  end
        
  def edit
    @note = Note.find(params[:id], current_auth)    
    #@url_path = notes_path << '/' << params[:id]
    #@url_method = :put
  end

  def create
    @note = Note.new(params[:note])
    @note.auth = current_auth

    if @note.create
      render action: "show"
    else
      #@url_path = notes_path
      #@url_method = :post      
      render action: "new"
    end    
  end
  
  def update
    @note = Note.find(params[:id], current_auth)

    if @note.update(params[:id], params[:note])
      render action: "show"
    else
      #@url_path = notes_path << '/' << params[:id]
      #@url_method = :put      
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
