# Base controller for any controllers that deal with moments
# currently that is HighlightsController, BookmarksController, NotesController


class BaseMomentsController < ApplicationController

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
    @moment = moment_resource.new(params[lower_resource_name.to_sym])
    @moment.auth = current_auth

    @results = @moment.save
    if @results.valid?
      redirect_to(@moment.to_path, notice: t("#{lower_resource_name.pluralize}.create success"))
    else
      flash[:error] = t("#{lower_resource_name.pluralize}.create failure")
      render :new
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
    notice = results.valid? ? t("#{lower_resource_name.pluralize}.destroy success") : t("{lower_resource_name.pluralize}.destroy failure")
    redirect_to(user_path(current_user), notice: notice)
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

end