object @comment

attributes :id, :content, :created_dt

child :user do
  attributes :id, :name, :username, :avatars
end