object @version

attributes :id, :title, :audio
attribute abbreviation: :abbr
attribute to_meta: :meta

node :language_name do |l|
  l.attributes.language.name
end

node :language_local_name do |l|
  l.attributes.language.local_name
end
