class NotesController < ApplicationController
  
  def index    
    @notes = Note.all(current_auth)    
  end

  def show
    @note = Note.find(params[:id], current_auth)
    raise ActionController::RoutingError.new('Not Found') unless @note
  end

  def new
    @note = Note.new()
    @url_path = notes_path
    @url_method = :post
  end
        
  def edit
    @note = Note.find(params[:id], current_auth)
    @note.precontent = @note.content_html
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
      @url_path = notes_path
      @url_method = :post      
      render action: "new"
    end    
  end
  
  def update
    @note = Note.find(params[:id], current_auth)

    if @return_note = @note.save_attributes(params[:note])
      @note = @return_note
      render action: "show"
    else
      @url_path = notes_path << '/' << params[:id]
      @url_method = :put      
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
