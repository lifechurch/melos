require 'spec_helper'

describe User do
  use_vcr_cassette "user"
  before :all do
    @params = { email: "testuser@youversion.com",
               username: "testuser",
               password: "tenders",
               agree: TRUE,
               verified: TRUE,
               locale: "en_US" }
  end

  describe ".save" do
    it "returns true for saving valid params" do
      user = User.new(@params)
      user.save.should be_true
    end

    it "returns false for invalid params" do
      bad_user = User.new({email: "blah@stuff.com"})
      bad_user.save.should be_false
      bad_user.errors.count.should == 3
    end
  end

  describe ".authenticate" do
    it "returns a User mash for correct username and password" do
      User.authenticate("testuser", "tenders").username.should == "testuser"
    end

    it "returns nil for an incorrect username and password" do
      User.authenticate("testuser", "asdf").should be_nil
    end
  end
end