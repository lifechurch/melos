module UsersHelper
  def highlight(path)
    "highlight" if current_page?(path)
  end
end
