class BookSelectorCell < Cell::Rails

  def display(opts = {})
    @reference = opts[:reference]
    @version  = Version.find(@reference[:version])
    render
  end

end
