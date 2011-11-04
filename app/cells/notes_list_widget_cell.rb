class NotesListWidgetCell < Cell::Rails
  helper ApplicationHelper

  def display(opts = {})
    @notes = opts[:notes].notes
    @total = opts[:notes].total
    @title = opts[:title] ||= "Notes" 
    @link = opts[:link] ||= notes_path
    render
  end

end
