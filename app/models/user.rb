require 'digest/md5'

class User
  extend ActiveModel::Naming
  include ActiveModel::Conversion
  include General
  attr_accessor :username, :password
  def persisted?
    false
  end

  attr_reader :errors

  def initialize(params = {})
    params[:agree] = true if params[:agree]
    reg_data = {id: 0, email: "", username: "", password: "", verified: false, agree: false}
    initialize_class(self, params, reg_data)
  end

  def self.find(id)
    response = YvApi.get('users/view', {:user_id => id, :auth_user_id => :id} ) do |errors|     
      @errors = errors.map { |e| e["error"] }
      return false
    end
    User.new(response)
  end

  def self.notes(id, auth)
    Note.all(id, auth)
  end
  
  def notes(auth)
    self.class.Note.all(id, auth)
  end
  
  def save
    @token = Digest::MD5.hexdigest "#{@username}.Yv6-#{@password}"
    @secure = true
    response = YvApi.post('users/create', class_attributes(:email, :username, :password, :verified, :agree, :token, :secure)) do |errors|
      @errors = errors.map { |e| e["error"] } if errors
      return false
    end    
    response
  end

  def self.authenticate(username, password)
    response = YvApi.get('users/authenticate', auth_username: username, auth_password: password) { return false }
  end
end
