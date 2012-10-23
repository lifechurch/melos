class LikesListWidgetCell < Cell::Rails

  def display(opts = {})
    @likes = opts[:likes]
    @total = opts[:likes].count if opts[:likes]
    @title = opts[:title] ||= "Likes"
    @link = opts[:link] ||= user_likes_path(opts[:user_id])
    render
  end

end
