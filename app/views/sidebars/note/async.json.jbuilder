json.array! @notes do |note|
  json.id         note.id
  json.title      note.title
  json.user do
    json.name     note.user.name
    json.avatars  note.user.avatars
  end
end
