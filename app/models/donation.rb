# Basic skeleton model to activate some simple validations.

class Donation

	include ActiveModel::Validations
	include ActiveModel::Translation

	attr_accessor :amount, :name, :email, :address, :city, :state, :zip

	with_options :presence => true do |d|
		d.validates :amount
		d.validates :name
		d.validates :email
		d.validates :address
		d.validates :city
		d.validates :state
		d.validates :zip
	end

	def initialize(attributes = {})  
		attributes.each do |name, value|
		  send("#{name}=", value)
		end  
	end


	def first_name
		name.split(" ",2).first
	end

	def last_name
		name.split(" ",2).last
	end

end