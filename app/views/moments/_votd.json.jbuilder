json.set! :kind, "votd"
json.object do
  json.references       moment.references
  json.day              moment.day
  json.week_day         moment.week_day
  json.date             moment.date
  json.created_dt       moment.created_at

  json.version          moment.version.id
  
  json.recent_versions do
    json.array! moment.recent_versions do |ver|
      json.id ver.id
      json.abbrev ver.abbreviation
    end
  end
  

end