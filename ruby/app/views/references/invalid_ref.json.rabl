object @reference
extends "references/show"

node(:content) do |ref|
  "<h1>#{t('ref.invalid chapter title')}</h1> <p>#{t('ref.invalid chapter text')}</p>"
end
node(:error){|ref| {message: 'Reference not found.', params: params.to_s}}
