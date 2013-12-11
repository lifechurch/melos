class NotesController < ApplicationController

  before_filter :set_sidebar, only: [:index]
  before_filter :force_login, only: [:show,:new,:edit,:create,:update,:destroy]
  
  # TODO: are #index or #related neccesary anymore?
  #def index
  #  @notes = Note.search(language_tag: I18n.locale, cache_for: YV::Caching.a_very_short_time)
  #  # drop language tag filter if no notes found
  #  @notes = Note.search(cache_for: YV::Caching.a_very_short_time) if @notes.empty?
  #  self.sidebar_presenter = Presenter::Sidebar::Notes.new
  #end

  def related
    #API Constraint to be put in model eventually
    page = params[:page] || 1
    ref = ref_from_params rescue not_found
    @notes = Note.for_reference(ref, language_tag: I18n.locale, page: page, cache_for: YV::Caching.a_short_time)
    @notes = Note.for_reference(ref, page:page, cache_for: YV::Caching.a_short_time) if @notes.empty?
    @reference_title = ref.human
    render template:"notes/index"
  end


  # TODO: figure out public/friends/private/draft display and authorization
  def show
    @note = current_auth ? Note.find(params[:id], auth: current_auth) : Note.find(params[:id])
    if @note.invalid?
      if @note.has_error?("Note is private")
         redirect_to(notes_path, notice: t("notes.is private")) and return
      
      elsif @note.has_error?("Note not found")
         render_404 unless current_auth # render 404 unless logged in
         @note = Note.find(params[:id]) # logged in, attempt to find the note without auth
      
      elsif @note.has_error?("Note has been reported and is in review")
         @note = Note.find(params[:id], auth: current_auth, force_auth: true)
      end
    end
  end


  # Action meant to render moment cards partial to html for ajax delivery client side
  # Currently being used for next page calls on moments feed.
  def _cards
    @user = User.find(params[:user_id])
    @moments = Note.all(auth: current_auth, page: @page)
    render partial: "moments/cards", locals: {moments: @moments, comments_displayed: false}, layout: false
  end


  def new
    @note = Note.new(params[:note])
  end


  def edit
    @note = Note.find(params[:id], auth: current_auth)
    redirect_to(moments_path) and return unless @note.user_id == current_auth.user_id
  end


  def create
    @note = Note.new(params[:note])
    @note.auth = current_auth

    result = @note.save
    result.valid? ? redirect_to(note_path(@note.id)) : render(action: "new")
  end



  def update
    @note = Note.find(params[:id], auth: current_auth)
    redirect_to(moments_path) and return unless @note.user_id == current_auth.user_id
    
    @note.auth = current_auth
    result = @note.update(params[:note])
    result.valid? ? redirect_to(note_path(@note.id)) : render(action: "edit")
  end



  def destroy
    @note = Note.find(params[:id], auth: current_auth)
    redirect_to(moments_path) and return unless @note.user_id == current_auth.user_id
    
    @note.auth = current_auth

    results = @note.destroy
    notice = results.valid? ? t("notes.destroy success") : t("notes.destroy failure")
    redirect_to(:back, notice: notice)
  end



  private

  # Set sidebar values for the Likes cell
  def set_sidebar
    @user_id = current_user.id if current_user
  end

end
