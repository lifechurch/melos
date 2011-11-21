class BetaRegistration < ActiveRecord::Base
  validates_presence_of :username
  before_validation :validate_username
  attr_accessor :password

  def validate_username
    if User.authenticate(username, password).nil?
      errors[:username] << "Authentication failed."
      return false
    end
  end
end
