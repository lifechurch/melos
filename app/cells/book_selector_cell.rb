class BookSelectorCell < Cell::Rails

  cache :display, :expires_in => 1.hour do |cell, opts|
    "#{opts[:version].id}_#{I18n.locale}"
  end

  cache :book_list, :expires_in => 1.hour do |cell, opts|
    "#{opts[:version]}_#{I18n.locale}"
  end

  def display(opts = {})
    @version = opts[:version]
    @presenter = opts[:presenter]
    render
  end

  def book_list(source)
    @books = case source
    when Version
      Version.books
    else
      source
    end

    render
  end

end
