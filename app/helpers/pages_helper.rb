module PagesHelper

  def page_not_found_messages
    (1..4).map{|i| t("app errors.404 message #{i}")}
  end

end