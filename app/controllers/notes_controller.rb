class NotesController < ApplicationController
  
  def index
    if current_auth
      @notes = Note.all(current_auth.id, current_auth)
    else
      @notes = Note.all(nil, nil)
    end
  end

  def show
    @note = Note.find(params[:id], current_auth)
    raise ActionController::RoutingError.new('Not Found') unless @note
  end

  def new
    if current_auth
      @note = Note.new()
      @url_path = notes_path
      @url_method = :post
    else
      redirect_to notes_path
    end
  end
        
  def edit
    if current_auth
      @note = Note.find(params[:id], current_auth)
      @note.reference = @note.reference.osis_noversion
      @url_path = notes_path << '/' << params[:id]
      @url_method = :put
    else
      redirect_to notes_path
    end    
  end

  def create
    @note = Note.new(params[:note])
    @note.auth = current_auth

    if @note.create
      render action: "show"
    else
      @url_path = notes_path
      @url_method = :post
      render action: "new"
    end    
  end
  
  def update
    @note = Note.find(params[:id], current_auth)

    if @note.update(params[:id], params[:note])
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
