class BookmarksListWidgetCell < Cell::Rails
  include ApplicationHelper
  helper_method :bible_path
  def display(opts = {})
    @bookmarks = Bookmark.for_reference(opts[:reference], auth: current_auth)
    puts @bookmarks
  end

end
