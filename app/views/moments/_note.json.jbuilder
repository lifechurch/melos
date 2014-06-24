json.set! :kind, "note"
json.object do
  json.set! :moment_title, (logged_in? and current_user_moment? moment) ? moment.title : moment.moment_title.html_safe
  json.title          moment.title
  json.content        moment.content
  json.status         t("notes.status.#{moment.user_status}")
  json.partial!   "/moments/moment_common", moment: moment
  json.set! :humanreferences, moment.references.collect {|r| r.human}.join(", ") if moment.respond_to?(:references)
  json.set! :reference_link_to, "/bible/" + moment.references[0].version_id.to_s + "/" + moment.references[0].usfm.join("+").to_s if moment.respond_to?(:references)
end