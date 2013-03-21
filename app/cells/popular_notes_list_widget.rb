class PopularNotesListWidgetCell < Cell::Rails

  def display(opts = {})
    @notes = opts[:notes]
    @total = opts[:notes].count if opts[:notes]
    @title = opts[:title] ||= "Most Popular Notes"
    render
  end

end

