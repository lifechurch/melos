json.array! @moments do |moment|
  json.partial! (!moment.nil? && moment.moment_partial_path.present? ? moment.moment_partial_path : ''), moment: moment
end