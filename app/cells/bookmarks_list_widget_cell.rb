class BookmarksListWidgetCell < Cell::Rails
  def display(opts = {})
    @bookmarks = Bookmark.for_reference(opts[:reference], auth: current_auth)
  end

end
