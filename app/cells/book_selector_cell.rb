class BookSelectorCell < Cell::Rails

  cache :display, :expires_in => 1.hour do |cell, opts|
    "#{opts[:version]}_#{I18n.locale}"
  end

  def display(opts = {})
    @version = opts[:version]
    render
  end

end
