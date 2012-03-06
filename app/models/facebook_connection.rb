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

  def find_friends(opts = {})
    opts = {api_version: "2.5", connection_type: "fb"}.merge(opts)
    face = Koala::Facebook::API.new(self.data[:access_token])
    response = face.get_connections("me", "friends")
    opts[:connection_user_ids] = response.map { |e| e["id"] }
    response = YvApi.post('users/find_connection_friends', opts)
    response.map { |u| User.new(u) }
  end

  def delete
    result = YvApi.post("users/delete_connection", connection_type: "fb", auth: auth)
    return result.facebook.nil?
  end
end

