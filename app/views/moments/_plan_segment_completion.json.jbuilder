json.set! :kind, moment.kind
json.object do
  json.set!       :moment_title, (logged_in? and current_user_moment? moment) ? moment.moment_title : moment.moment_title.html_safe
  json.body_text  moment.body_text
  json.action_url moment.action_url
  json.percent_complete moment.percent_complete
  json.segment    moment.segment
  json.total_segments moment.total_segments
  json.set!       :plan_id, moment.plan_id
  json.partial!   "/moments/moment_common", moment: moment
  json.actions do
    json.read_plan true
    json.about_plan true
  end
end