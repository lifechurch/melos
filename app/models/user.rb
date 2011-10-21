require 'digest/md5'


class User
  extend ActiveModel::Naming
  include ActiveModel::Conversion
  attr_accessor :username, :password
  def persisted?
    false
  end

  def attributes(*args)
    array = args
    array = self.instance_variables.map { |e| e.to_s.gsub("@", "").to_sym} if array == []
    attrs = {}
    array.each do |var|
      attrs[var] = instance_variable_get("@#{var}")
    end
    attrs
  end

  attr_reader :errors

  def initialize(params = {})
    params[:agree] = true if params[:agree]
    reg_data = {email: "", username: "", password: "", verified: false, agree: false}
    reg_data.merge! params
    reg_data.each do |k,v|
      # Create instance variable
      self.instance_variable_set("@#{k}", v)
      # Create the getter
      self.class.send(:define_method, k, proc{self.instance_variable_get("@#{k}")})
      # Create the setter
      self.class.send(:define_method, "#{k}=", proc{|v| self.instance_variable_set("@#{k}", v)})
    end
  end


  def save
    @token = Digest::MD5.hexdigest "#{@username}.Yv6-#{@password}"
    @secure = true
    response = YvApi.post('users/create', attributes(:email, :username, :password, :verified, :agree, :token, :secure)) do |errors|
      @errors = errors.map { |e| e["error"] } if errors
      return false
    end
    response
  end

  def self.authenticate(username, password)
    response = YvApi.get('users/authenticate', auth_username: username, auth_password: password) { return false }
  end
end
