class FacebookConnection < YV::Connection::Base
  attribute :access_token
  attribute :credentials
  attribute :uid
  attribute :info

  attribute :connection_type
  attribute :connection_user_id
  attribute :data

  def connection_type
    "fb"
  end

  def before_save
    self.connection_type = connection_type
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
    opts = {connection_type: connection_type}.merge(opts)
    response = api_client.get_connections("me", "friends")

    ids = response.map { |e| e["id"] }
    return fetch_friends(ids,opts)
  end

  def nickname
    data.name
  end

  def update_token
    new_access_info = oauth_client.exchange_access_token_info(self.data[:access_token])
    new_token       = new_access_info["access_token"]
    if new_token

      # Delete the existing connection in the API
      self.delete
      # Recreate some stuff for saving the connection with the new token
      self.credentials = {}
      self.info = {}
      self.credentials["token"] = new_token
      self.info["name"] = self.data[:name]
      self.info["nickname"] = self.data[:screen_name]
      self.connection_user_id = self.uid = self.data[:user_id]
      self.save
    end
  end

  private

  def oauth_client
    @oauth_client ||= Koala::Facebook::OAuth.new(self.data[:appid], self.data[:secret])
  end

  def api_client
    @api_client ||= Koala::Facebook::API.new(self.data[:oauth_token] || self.data[:access_token])
  end

end

