json.set! :kind, "votd"
json.object do
  json.references       moment.references
  json.day              moment.day
  json.week_day         moment.week_day
  json.date             moment.date
  json.created_dt       moment.created_at

  json.version          moment.version.id

  json.set! :votd_date,  l(moment.created_at, :format => :votd)
  json.set! :title,     t("moments.vod.title")
  json.set! :calendar_img, image_tag("moment-vod-calendar-img.png")

  json.recent_versions do
    json.array! moment.recent_versions do |ver|
      json.id ver.id
      json.abbrev ver.abbreviation
    end
  end
  json.actions do
    json.read true
    json.subscribable true if current_user
    # json.share true
  end

  if current_user
    json.subscription do  
      subscription =       VodSubscription.all(auth: current_user.auth)
      json.path            user_vod_subscriptions_path(current_user.username)
      json.time            subscription.email.time
      json.version_id      subscription.email.version_id
      json.versions        Version.by_language({:only => I18n.locale.to_s}).map{|v| { version_id: v.id, title: v.title } }
    end
  end
end
