class NotesListWidgetCell < Cell::Rails
  helper ApplicationHelper

  def display(opts = {})
    @notes = opts[:notes]
    # TODO: was opts[:notes].total, but Array has no total; need to use a
    # ResourceList-style thing here to get a .total if that's what we want
    @total = @notes.count
    @title = opts[:title] ||= "Notes" 
    @link = opts[:link] ||= notes_path
    render
  end

end
