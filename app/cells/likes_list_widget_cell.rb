class LikesListWidgetCell < Cell::Rails
  helper ApplicationHelper

  def display(opts = {})
    @notes = opts[:likes].notes
    @total = opts[:likes].total
    @title = opts[:title] ||= "Likes"
    @link = opts[:link] ||= notes_path
    render
  end

end
