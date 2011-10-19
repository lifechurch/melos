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

  describe "#attributes" do
    before :each do
      @fake_user = User.new({alpha: "foo", beta: "bar", gamma: "baz"})
    end

    it "hashifies all the instance variables without an argument" do
      @fake_user = User.new({alpha: "foo", beta: "bar", gamma: "baz"})
      all_attrs = @fake_user.attributes
      all_attrs[:alpha].should == "foo"
      all_attrs[:beta].should == "bar"
      all_attrs[:gamma].should == "baz"
    end

    it "hashifies a few instance variables from passed symbols" do
      @fake_user.attributes(:alpha, :beta).should == {alpha: "foo", beta: "bar"}
    end
  end

  describe ".save" do
    it "returns true for saving valid params" do
      user = User.new(@params)
      user.save.should_not be_false
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
  
  describe "id" do
    it "returns the user's ID for a valid user" do
      User.authenticate("testuser", "tenders").id.should == 4163157
    end
  end
end