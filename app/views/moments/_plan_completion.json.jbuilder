json.set! :kind, moment.kind
json.object do
  json.set!       :moment_title, (logged_in? and current_user_moment? moment) ? moment.moment_title : moment.moment_title.html_safe
  json.body_text  moment.body_text
  json.action_url moment.action_url
  json.set!       :plan_id, moment.plan_id
  json.set!       :subscribed, (@subscriptions.include? moment.plan_id)
  json.partial!   "/moments/moment_common", moment: moment
  json.actions do
    json.about_plan true
    json.start_plan true
  end
end