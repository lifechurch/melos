collection @notes
attributes :id, :title
child(:user) {
    attributes :name, :avatars
}