# Base controller for any controllers that deal with moments
# currently that is HighlightsController, BookmarksController, NotesController

class BaseMomentsController < ApplicationController

  respond_to :html, :js

  before_filter :find_resource, only: [:edit,:update,:destroy]

  # Abstractions for moments related controllers.  Simplifies much of the controllers
  # Subclasses: BookmarksController, HighlightsController, NotesController
  
  class << self

    attr_reader :moment_resource_class
    attr_reader :moment_comments_displayed

    def moment_resource(klass)
      @moment_resource_class = klass.constantize
    end

    def moment_comments_display(bool)
      @moment_comments_displayed = bool
    end
  end

  # Action renders cards partial for the returned moments
  def _cards
    # If our user_id param is present, use that to find user, otherwise assume current user
    @user = params[:user_id].present? ? User.find(params[:user_id]) : current_user
    opts = {auth: current_auth, page: @page}
    opts.merge!(user_id: params[:uid].to_i) if params[:uid]
    @moments = moment_resource.all(opts)
    render partial: "moments/cards", locals: {moments: @moments, comments_displayed: self.class.moment_comments_displayed}, layout: false
  end


  def new
    @moment = moment_resource.new(params[lower_resource_name.to_sym])
  end

  def create
    @moment       = moment_resource.new(params[lower_resource_name.to_sym])
    @moment.auth  = current_auth
    @results      = @moment.save

    respond_to do |format|
      format.html {
        if @results.valid?
          redirect_to(@moment.to_path, notice: t("#{lower_resource_name.pluralize}.create success"))
        else
          flash[:error] = t("#{lower_resource_name.pluralize}.create failure")
          render :new
        end
      }
      format.js {
        render text: "", status: 400 and return unless @results.valid?
        #renders resource-dir/create.js.rabl on success
      } 
    end
  end


  def edit
    # before_filter :find_resource
  end

  def update
    @results = @moment.update(params[lower_resource_name.to_sym])
    if @results.valid?
      redirect_to(@moment.to_path,notice: t("#{lower_resource_name.pluralize}.update success"))
    else
      render(action: "edit")
    end
  end

  def destroy
    results = @moment.destroy

    respond_to do |format|
      format.html {
        notice      = results.valid? ? t("#{lower_resource_name.pluralize}.destroy success") : t("{lower_resource_name.pluralize}.destroy failure")
        destination = "#{lower_resource_name.pluralize}_user_url" # bookmarks_user_url
        redirect_to( self.send(destination.to_sym, id: current_auth.username) , notice: notice)
      }
      format.js {
        status = results.valid? ? 200 : 400
        render text: "", status: status and return
      }
    end
  end

  private

  def find_resource
    @moment = moment_resource.find(params[:id], auth: current_auth)
    redirect_to(moments_path) and return unless @moment.user_id == current_auth.user_id
    @moment.auth = current_auth
  end

  def moment_resource
    self.class.moment_resource_class
  end

  def lower_resource_name
    self.class.moment_resource_class.to_s.downcase # Highight -> highlight, Bookmark -> bookmark
  end

  def find_moment
    @moment = Moment.find(params[:id], auth: current_auth)
  end

  def mobile_redirect
    render_404 if @moment.nil? || @moment.errors.present?
    if request.env["X_MOBILE_DEVICE"].present?
      case request.env["X_MOBILE_DEVICE"]
      when /iphone|iPhone|ipad|iPad|ipod|iPod/
        @user_agent = "ios"
        @native_url = "youversion://moments/#{@moment.id}"               
      when /android|Android/
        @user_agent = "android"
        @native_url = "youversion://moments/#{@moment.id}"
      end 
    end
  end

end