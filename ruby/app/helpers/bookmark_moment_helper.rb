module BookmarkMomentHelper
  def bookmark_title(moment)
    if logged_in? and current_user_moment? moment
      moment.title || moment.references.collect {|r| r.human}.join(", ")
    else
      moment.moment_title.html_safe if moment.moment_title.present?
    end
  end
end