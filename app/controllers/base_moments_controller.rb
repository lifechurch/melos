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


  def create
    @resource = moment_resource.new(params[lower_resource_name.to_sym])
    @resource.auth = current_auth

    result = @resource.save
    notice = result.valid? ? t("#{lower_resource_name.pluralize}.create success") : t("#{lower_resource_name.pluralize}.create failure")
    redirect_to(:back, notice: notice)
  end


  def edit
    # before_filter :find_resource
  end

  def update
    results = @resource.update(params[lower_resource_name.to_sym])
    results.valid? ? redirect_to(:back, notice: t("#{lower_resource_name.pluralize}.update success")) : render(action: "edit")
  end

  def destroy
    results = @resource.destroy
    notice = results.valid? ? t("#{lower_resource_name.pluralize}.destroy success") : t("{lower_resource_name.pluralize}.destroy failure")
    redirect_to(:back, notice: notice)
  end

  private

  def find_resource
    @resource = moment_resource.find(params[:id], auth: current_auth)
    redirect_to(moments_path) and return unless @resource.user_id == current_auth.user_id
    @resource.auth = current_auth
  end

  def moment_resource
    self.class.moment_resource_class
  end

  def lower_resource_name
    self.class.moment_resource_class.to_s.downcase # Highight -> highlight, Bookmark -> bookmark
  end

end