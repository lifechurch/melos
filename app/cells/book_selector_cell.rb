class BookSelectorCell < Cell::Rails
include ApplicationHelper
helper_method :bible_path

  def display(opts = {})
    @reference = opts[:reference]
    @version  = Version.find(@reference[:version])
    render
  end

end
