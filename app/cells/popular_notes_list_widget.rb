class PopularNotesListWidgetCell < Cell::Rails

  def display(opts = {})
    @notes = opts[:notes]
    @total = opts[:notes].count if opts[:notes]
    @title = opts[:title] ||= "Most Popular Notes"
    @link = opts[:link] ||= user_likes_path(opts[:user_id])
    render
  end

end

