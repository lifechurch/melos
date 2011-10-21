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
    
    @tester = @note.save
    #render action: "show"
    
    #if @note.save
    #  render action: "show"
    #else
    #  flash[:alert] = []
    #  @note.errors.each do |error|       
    #    flash.now[:alert] << error
    #  end
    #  render action: "new"
    #end    
  end
  
  def update
    @note = Note.find(params[:id], current_user)
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
    @note = Note.find(params[:id], current_user)
    
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
