class FacebookConnection < YouVersion::Connection::Base
  attribute :access_token
  attribute :credentials
  attribute :uid
  attribute :info

  attribute :connection_type
  attribute :connection_user_id
  attribute :data


  def before_save
    self.connection_type = "fb"
    self.connection_user_id = self.uid
    self.data = {
            screen_name:  self.info["nickname"],
            user_id:      uid,
            oauth_token:  self.credentials["token"],
            key:          Cfg.facebook_app_id,
            secret:       Cfg.facebook_secret
           }.to_json
  end

  def find_friends
    face = Koala::Facebook::API.new(self.data[:oauth_token])
    response = face.get_connections("me", "friends")
    friends = response.map { |e| e["id"] }
    puts friends
  end
end

