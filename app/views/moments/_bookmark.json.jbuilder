moment_title = (logged_in? and current_user_moment? moment) ? (moment.title || moment.references.collect {|r| r.human}.join(", ")) : moment.moment_title.html_safe

json.set! :kind, "bookmark"
json.object do
  json.moment_title   moment_title
  json.labels do
    json.array! moment.labels
  end
  json.partial!   "/moments/moment_common", moment: moment 
end