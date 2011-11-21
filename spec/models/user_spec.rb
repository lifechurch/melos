require 'spec_helper'

describe User do
#  use_vcr_cassette "user"
  before :all do
    @params = { email: "testuser@youversion.com", username: "testuser", password: "tenders", agree: TRUE, verified: TRUE, locale: "en_US" }
  end

  describe "#attributes" do
    before :each do
      @fake_user = User.new({alpha: "foo", beta: "bar", gamma: "baz"})
    end

    it "hashifies all the instance variables without an argument" do
      all_attrs = @fake_user.attributes
      all_attrs[:alpha].should == "foo"
      all_attrs[:beta].should == "bar"
      all_attrs[:gamma].should == "baz"
    end

    it "hashifies a few instance variables from passed symbols" do
      @fake_user.attributes(:alpha, :beta).should == {alpha: "foo", beta: "bar"}
    end
  end

  describe "#create" do
    it "returns true for creating a user with valid params" do
      user = User.new(email: "testuser9@youversion.com", username: "testuser9", password: "tenders", agree: true, verified: true)
      user.create
      user.create.should_not be_false
    end

    it "returns false for invalid params" do
      bad_user = User.new({email: "blah@stuff.com"})
      bad_user.create.should be_false
      bad_user.errors.count.should == 3
    end
  end

  describe ".authenticate" do
    it "returns a User mash for correct username and password" do
      User.authenticate("testuser", "tenders").username.should == "testuser"
    end

    it "returns nil for an incorrect username and password" do
      User.authenticate("testuser", "asdf").should be_false
    end
  end

  describe "#id" do
    it "returns the user's ID for a valid user" do
      User.authenticate("testuser", "tenders").id.should == 4163177
    end
  end

  describe ".find" do
    it "finds a user by their id" do
      auth = nil
      friend = User.find(4163177)
      friend.username.should == "testuser"
      friend.email.should be_empty

      auth = Hashie::Mash.new({id: 4163177, username: "testuser", password: "tenders"})
      User.find(4163177, auth).email.should == "testuser@youversion.com"

    end

    it "finds a user by their username" do
    end

    it "finds the current user" do

    end
  end
end
