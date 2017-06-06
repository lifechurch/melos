json.array! @moments do |moment|
  json.partial! moment.moment_partial_path, moment: moment
end