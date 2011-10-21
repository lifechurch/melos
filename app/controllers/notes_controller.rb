class NotesController < ApplicationController
  
  def index    
    @notes = Note.all(current_auth)    
  end
  
  def new
    @note = Note.new()
  end
  
  def edit
    @note = Note.find(params[:id])   
  end
  
  def show
    @note = Note.find(params[:id], current_auth)
  end
  
  def create
    @note = Note.new(params)
    @note.auth = current_auth
    
    if @note.save
      render action: "show"
    else
      flash[:alert] = []
      @note.errors.each do |error|       
        flash.now[:alert] << error
      end
      render action: "new"
    end    
  end
  
  def update
    @note = Note.find(params[:id], current_auth)
    @note.user = current_user 

    if @note.update_attributes(params[:note])
      render action: "show"
    else
      flash[:alert] = []
      @note.errors.each do |error|       
        flash.now[:alert] << error
      end
      render action: "edit"
    end       
  end
  
  def delete
    @note = Note.find(params[:id], current_auth)
    
    if @note.destroy
      redirect_to '/'
    else
      flash[:alert] = []
      @note.errors.each do |error|       
        flash.now[:alert] << error
      end
      render action: "index"
    end
  end
  
end
