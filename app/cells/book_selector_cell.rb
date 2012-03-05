class BookSelectorCell < Cell::Rails
include ApplicationHelper
helper_method :bible_path
  cache :display do |cell, opts|
    puts "book selector cache key is #{@reference}_#{@version}"
    "#{opts[:reference]}_#{opts[:reference].version || opts[:version]}"
  end

  def display(opts = {})
    @reference = opts[:reference]
    @version  = Version.find(@reference[:version]) || opts[:version]
    render
  end

end
