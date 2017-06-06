require 'spec_helper'
# http://www.youtube.com/watch?v=Dg_YueZ4fi8#t=0m53

describe KidsRegistration do

  let(:registration) { KidsRegistration.new() }

  it 'should create a registration' do
    registration.phone_number = "5558675309"
    registration.save.should be_true
  end

  it 'should fail when given an invalid phone number' do
    registration.phone_number = "1640"
    registration.save.should be_false
    registration.errors.messages.should have_key :phone_number
  end

  it 'should fail when given no phone number' do
    registration.phone_number = ""
    registration.save.should be_false
    registration.errors.messages.should have_key :phone_number
  end

  it 'should fail when a number already exists' do
    registration.phone_number = "(555)867-5309"
    registration.save.should be_true
    dup = KidsRegistration.new(phone_number: "5558675309")
    dup.save.should be_false
    dup.errors.messages.should have_key :phone_number
  end

  it 'should strip chars' do
    registration.phone_number = "(555) 867-5309"
    registration.save.should be_true
    registration.phone_number.should == "5558675309"
  end

end