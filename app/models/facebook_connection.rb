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
            platform:     "web3",
            name:         self.info["name"],
            screen_name:  self.info["nickname"],
            user_id:      uid,
            access_token: self.credentials["token"],
            appid:        Cfg.facebook_app_id,
            secret:       Cfg.facebook_secret,
            created_dt:   Time.now.to_i
           }.to_json
  end

  def find_friends(opts = {})
    opts = {api_version: "2.5", connection_type: "fb"}.merge(opts)
    face = Koala::Facebook::API.new(self.data[:oauth_token] || self.data[:access_token])
    response = face.get_connections("me", "friends")
    puts "hey response is #{response}"
    if response.empty?
      []
    else
      opts[:connection_user_ids] = response.map { |e| e["id"] }
      response = YvApi.post('users/find_connection_friends', opts)
      response.map { |u| User.new(u) }
    end
  end

  def delete
    result = YvApi.post("users/delete_connection", connection_type: "fb", auth: auth)
    return result.facebook.nil?
  end
end

