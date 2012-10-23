class NotesListWidgetCell < Cell::Rails
  include ApplicationHelper
  helper_method :bible_path

  def display(opts = {})
    @notes = opts[:notes]
    # TODO: was opts[:notes].total, but Array has no total; need to use a
    # ResourceList-style thing here to get a .total if that's what we want
    @title = opts[:title] ||= "Notes"
    @link = opts[:link] ||= notes_path
    render
  end

  def stub(opts = {})
    @title = opts[:title] ||= "Notes"
    @reference = opts[:reference]
    render
  end

end
