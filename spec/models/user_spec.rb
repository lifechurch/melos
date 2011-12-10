require 'spec_helper'

describe User do
#  use_vcr_cassette "user"
  before :all do
    @params = { email: "testuser@youversion.com", username: "testuser", password: "tenders", agree: TRUE, verified: TRUE, locale: "en_US" }
    @testuser = ensure_user({username: "testuser", password: "tenders"})
    @auth = Hashie::Mash.new({user_id: @testuser.id, username: "testuser", password: "tenders"})
  end

#   describe "#attributes" do
#     before :each do
#       @fake_user = User.new({alpha: "foo", beta: "bar", gamma: "baz"})
#     end
# 
#     it "hashifies all the instance variables without an argument" do
#       all_attrs = @fake_user.attributes
#       all_attrs[:alpha].should == "foo"
#       all_attrs[:beta].should == "bar"
#       all_attrs[:gamma].should == "baz"
#     end
# 
#     it "hashifies a few instance variables from passed symbols" do
#       @fake_user.attributes(:alpha, :beta).should == {alpha: "foo", beta: "bar"}
#     end
#   end

  describe ".authenticate" do
    it "returns a User mash for correct username and password" do
      User.authenticate("testuser", "tenders").username.should == "testuser"
    end

    it "returns nil for an incorrect username and password" do
      User.authenticate("testuser", "asdf").should be_false
    end
  end

  describe ".register" do
    it "returns true for creating a user with valid params" do
      User.authenticate("testuser999", "tenders").should be_false
      result = User.register(email: "testuser999@youversion.com", username: "testuser999", password: "tenders", agree: true, verified: true)
      result.should be_true
    end

    it "returns false for invalid params" do
      bad_user = User.register({email: "blah@stuff.com"})
      bad_user.should_not === true 
    end
  end

  describe ".find" do
    it "finds a user by their id" do
      auth = nil
      friend = User.find(@testuser.id)
      friend.username.should == "testuser"
      friend.email.should be_empty

      auth = Hashie::Mash.new({user_id: @testuser.id, username: "testuser", password: "tenders"})
      User.find(auth).email.should == "testuser@youversion.com"

    end

    it "finds a user by their username" do
    end

    it "finds the current user" do

    end
  end

  describe "#recent_activity" do
    it "returns objects created by the user" do
      Bookmark.new(reference: "gen.1.1.asv", title: "community bookmark", auth: @auth).save.should be_true
      Note.new(reference: "gen.1.1.asv", title "community note", content: "note", auth: @auth).save.should be_true
      re_act = @testuser.recent_activity
      re_act.detect { |e| e.title == "community bookmark" if e.respond_to?("title") }.should_not be_nil
      re_act.detect { |e| e.title == "community note" if e.respond_to?("title") }.should_not be_nil
    end
  end
end
