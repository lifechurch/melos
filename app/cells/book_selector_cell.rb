class BookSelectorCell < Cell::Rails
include ApplicationHelper
helper_method :bible_path
  cache :display do |cell, opts|
    "#{@reference}_#{@version}"
  end

  def display(opts = {})
    @reference = opts[:reference]
    @version  = Version.find(@reference[:version]) || opts[:version]
    render
  end

end
