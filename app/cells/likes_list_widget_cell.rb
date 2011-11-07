class LikesListWidgetCell < Cell::Rails
  helper ApplicationHelper

  def display(opts = {})
    @likes = opts[:likes]
    @total = opts[:likes].count
    @title = opts[:title] ||= "Likes"
    @link = opts[:link] ||= user_likes_path(opts[:user_id])
    render
  end

end
