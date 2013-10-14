class KidsRegistration < ActiveRecord::Base

  attr_accessible :phone_number
  validates :phone_number, format: { with: /\A(\((\d{3})\)|\d{3})[ |\.|\-]?(\d{3})[ |\.|\-]?(\d{4})\z/,
                                     message: "is not a valid 10 digit phone number. Please try again." }
  validates :phone_number, uniqueness: { message: "has already been registered"}
  before_validation :strip_chars

  private

  def strip_chars
    self.phone_number.gsub!(/[\(\)\-\.\s]/, '')
  end
end