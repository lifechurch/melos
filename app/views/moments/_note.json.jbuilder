json.set! :kind, "note"
json.object do
  json.set! :moment_title, (logged_in? and current_user_moment? moment) ? moment.title : moment.moment_title.html_safe
  json.title          moment.title
  json.content        moment.content
  json.status         t("notes.status.#{moment.user_status}")
  json.partial!   "/moments/moment_common", moment: moment
  json.set! :interact_with, current_user.present? ? current_user.interact_with?(moment) : false
end