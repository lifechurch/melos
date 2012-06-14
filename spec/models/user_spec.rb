require 'spec_helper'

describe User do
  before :all do
    @test_creds = {username: "testuser#{rand(10000)}", password: 'tenders'}
    @testuser = ensure_user @test_creds
    @auth = @testuser.auth
    @test_creds[:username]
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
      User.authenticate(@test_creds[:username], @test_creds[:password]).username.should == @test_creds[:username]
    end

    it "returns nil for an incorrect username and password" do
      expect { User.authenticate(@test_creds[:username], "asdf") }.to raise_error
    end
  end

  describe ".register" do
    it "returns true for creating a user with valid params" do
      destroy_user({username: "testuser999", password: @test_creds[:password]})
      expect { User.authenticate("testuser999", @test_creds[:password]) }.to raise_error
      result = User.register(email: "testuser999@youversion.com", username: "testuser999", password: @test_creds[:password], agree: true, verified: true)
      result.should be_true
    end

    it "returns false for invalid params" do
      bad_user = User.register({email: "blah@stuff.com"})
      bad_user.should_not === true
    end
  end

  describe ".find" do
    before :all do
      @new_user = ensure_user({username: "testuser12312", password: "tenders"})
    end

    it "finds a user by their id" do
      auth = nil
      friend = User.find(@new_user.id)
      friend.username.should == @new_user.username
      friend = User.find(@new_user.id.to_i)
      friend.username.should == @new_user.username
    end

    it "finds itself" do
      puts User.find(@new_user.id, auth: Hashie::Mash.new({user_id: @new_user.id, username: @new_user.username, password: "tenders"})).email.should_not be_nil
      puts User.find(@new_user.username, auth: Hashie::Mash.new({user_id: @new_user.id, username: @new_user.username, password: "tenders"})).email.should_not be_nil
    end

    it "finds a user by their username" do
      friend = User.find(@new_user.username)
      friend.username.should == @new_user.username
    end
  end

  describe "#recent_activity" do
    it "returns objects created by the user" do
      pending "Need to fix bookmarks and notes"
      Bookmark.new(reference: "gen.1.1.asv", title: "community bookmark", auth: @auth).save.should be_true
      Note.new(reference: "gen.1.1.asv", title: "community note", content: "note", auth: @auth).save.should be_true
      re_act = @testuser.recent_activity
      re_act.each { |a| a.class.should be_in [Note, User, Bookmark]  }
    end
  end

  describe "#update_avatar" do
    # TODO: Seems wonky; am I breaking the API?
  end
  describe "updating email and password" do
    ## WARNING, THESE TESTS BREAK EVERYTHING
    before :all do
      @confused_1 = ensure_user({username: "testuser12342222", password: "tenders"})
      # This is tied to an account of the same name, but the password keeps
      # getting reset, so we can't log in to it.
      @confused_email = "testuser123428@youversion.com"
    end
    it "should be able to change their email address" do
      @confused_1.update_email("new_user@youversion.com").should be_true
      @confused_1.update_email("foo").should be_false
    end

    # it "should request a password change" do
    #   User.forgot_password(@confused_email).should be_true
    #   User.forgot_password("foo").should be_false
    # end
  end

  describe "following and followers" do
    before :all do
      @testuser_2 = ensure_user({username: "testuser2", password: "tenders"}) 
      @testuser_2_auth = Hashie::Mash.new(username: @testuser_2.username, password: "tenders", user_id: @testuser_2.id)
    end
    it "should be able to follow a user" do
      @testuser.follow(auth: @testuser_2_auth).should be_true
      # Do it again to make sure it doesn't throw an error 
      @testuser.follow(auth: @testuser_2_auth).should be_true
    end

    it "should be able to unfollow a user" do
      @testuser_2.follow(auth: @auth) 
      @testuser_2.unfollow(auth: @auth).should be_true
      # Do it again to make sure it doesn't throw an error 
      @testuser_2.unfollow(auth: @auth).should be_true
    end
  end

  describe "listing followers and following" do
    before :all do
      @testuser_2 = ensure_user({username: "testuser2", password: "tenders"}) 
      @testuser_2_auth = Hashie::Mash.new(username: @testuser_2.username, password: "tenders", user_id: @testuser_2.id)
      @testuser.follow(auth: @testuser_2_auth).should be_true
      @testuser_2.follow(auth: @auth).should be_true 
      @testuser_3 = ensure_user({username: "testuser3333", password: "tenders"})
    end

    it "should list all of the users a user is following" do
      @testuser.following.first.should == @testuser_2
      @testuser.following_user_id_list.should == [@testuser_2.username]
      @testuser_3.following.should == []
    end

    it "should list all of the users following a user" do
      @testuser.followers.first.should == @testuser_2
      @testuser.follower_user_id_list.should == [@testuser_2.id.to_i]
      @testuser_3.followers.should == []
    end
  end

  describe "configuration" do; end

  describe "profile" do
    # Test:
    # user_avatar_url
    # s3_user_avatar_url
    # to_param
    # website_url
    # website_human
    #
    # Profile:
    # first_name
    # last_name
    # bio
    # location
    # postal_code
    # website

    before :all do
      @lotsa_info = ensure_user({username: "testuser-lotsainfo", password: "tenders"})
      info = {first_name: "foo",
              last_name: "bar",
              bio: "I have a bio",
              location: "Austin, TX",
              postal_code: "78759",
              website: "www.youversion.com"}
      @lotsa_info.update(info).should be_true
    end

    it "should return info about itself" do
      puts @lotsa_info.user_avatar_url.should be_a Hashie::Mash
      puts @lotsa_info.s3_user_avatar_url.should be_a Hashie::Mash
      puts @lotsa_info.to_param.should == "testuser-lotsainfo"
      puts @lotsa_info.website_url.should == "http://www.youversion.com"
      puts @lotsa_info.website_human.should == "youversion.com"

    end
  end


  # describe "highlight colors" - move to highlight.rb?

end
