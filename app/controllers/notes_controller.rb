class NotesController < ApplicationController
  
  def index
    @notes = Note.all(current_user)    
  end
  
  def new
    @note = Note.new()
  end
  
  def edit
    @note = Note.find(params[:id])   
  end
  
  def show
    @note = Note.find(params[:id], current_user)
  end
  
  def create
    @note = Note.new(params)
    @note.user = current_user 

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
  end
  
  def delete
  end
  
end
