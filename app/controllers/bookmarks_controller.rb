class BookmarksController < BaseMomentsController

  # Base moment controller abstractions
    moment_resource "Bookmark"
    moment_comments_display false

  # Filters
    before_filter :force_login
    before_filter :mobile_redirect, only: [:show]

  def show
    @bookmark = Bookmark.find(params[:id], auth: current_auth)
    raise ActionController::RoutingError.new('Not Found') unless @bookmark
  end

end
