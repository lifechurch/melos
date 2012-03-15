class BookSelectorCell < Cell::Rails
include ApplicationHelper
helper_method :bible_path
  cache :display, :expires_in => 6.hours do |cell, opts|
    "#{opts[:version]}_#{I18n.locale}"
  end

  def display(opts = {})
    @version = opts[:version]
    render
  end

end
