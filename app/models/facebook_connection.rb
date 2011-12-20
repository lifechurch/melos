class FacebookConnection < YouVersion::Connection::Base
  attr_accessor :access_token
  attr_accessor :user_id
  attr_accessor :name
  attr_accessor :appid
  attr_accessor :secret
  attr_accessor :username

  attribute :connection_type
  attribute :connection_user_id
  attribute :data

  # YV API interaction
  # paths
  def create_path
    "users/create_connection"
  end

  def delete_path
    "users/delete_connection"
  end

  def before_save
    connection_type = "fb"
    connection_user_id = user_info.username unless username
    data = {name: name, user_id: user_id, access_token: access_token, appid: appid, secret: secret}
  end

  # Connection interaction
  #
  def default_params
    {access_token: access_token}
  end


  def user_info_path
    "https://graph.facebook.com/me"
  end

  def find_friends_path
    "https://graph.facebook.com/me/friends"
  end


  def delete

  end


  
end

