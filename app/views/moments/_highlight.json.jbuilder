moment_title = (logged_in? and current_user_moment? moment) ? moment.references.collect {|r| r.human}.join(", ") : moment.moment_title.html_safe

json.set! :kind, "highlight"

json.object do
  json.set! :moment_title,   moment_title
  json.partial! "moment_common", moment: moment
end