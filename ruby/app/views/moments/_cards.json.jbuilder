json.array! @moments do |moment|
  json.partial! (!moment.nil? && !moment.kind_of?(Array) && moment.moment_partial_path.present? ? moment.moment_partial_path : 'moments/generic'), moment: moment
end