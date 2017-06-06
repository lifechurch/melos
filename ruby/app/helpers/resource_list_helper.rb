module ResourceListHelper

  def previous_page_path
    url_for page: @page-1
  end

  def next_page_path
    url_for page: @page+1
  end
end
