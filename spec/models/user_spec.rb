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
      @new_user = ensure_user
    end

    it "finds a user by their id" do
      auth = nil
      friend = User.find(@new_user.id)
      friend.username.should == @new_user.username
      friend = User.find(@new_user.id.to_i)
      friend.username.should == @new_user.username
    end

    it "finds itself" do
      User.find(@new_user.auth.user_id, {auth: @new_user.auth}).email.should_not be_nil
      User.find(@new_user.username, {auth: @new_user.auth}).email.should_not be_nil
    end

    it "finds a user by their username" do
      friend = User.find(@new_user.username)
      friend.username.should == @new_user.username
    end
  end

  describe "#recent_activity" do
    it "returns objects created by the user" do
      Bookmark.new(references: "gen.1.1.kjv", title: "community bookmark", auth: @auth).save.should be_true
      Note.new(reference: "gen.1.1.kjv", title: "community note", content: "note", auth: @auth).save.should be_true
      re_act = @testuser.recent_activity
      re_act.each { |a| a.class.should be_in [Note, User, Bookmark, Badge]  }
    end
  end

  describe "#update_avatar" do
    # TODO: Seems wonky; am I breaking the API?
  end
  describe "updating email and password" do
    ## WARNING, THESE TESTS BREAK EVERYTHING
    before :all do
      # This is tied to an account of the same name, but the password keeps
      # getting reset, so we can't log in to it.
    end
    it "should be able to change their email address" do
      @confused_1 = ensure_user({username: "testuser12342222", password: "tenders"})
      @confused_1.update_email("new_user@youversion.com").should be_true
      @confused_1.update_email("foo").should be_false
    end

    it "should request a password change" do
      @whoami = ensure_user
      User.forgot_password(@whoami.email).should be_true
      User.forgot_password("foo").should be_false
    end
  end

  describe "following and followers" do
    before :all do
      @testuser_2 = ensure_user
      @testuser_2_auth = @testuser_2.auth
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
      @testuser_2 = ensure_user
      @testuser_2_auth = @testuser_2.auth
      @testuser.follow(auth: @testuser_2_auth).should be_true
      @testuser_2.follow(auth: @auth).should be_true 
      @testuser_3 = ensure_user
    end

    it "should list all of the users a user is following" do
      @testuser.following.first.should == @testuser_2
      @testuser.all_following.first.should == @testuser_2.id.to_i
      @testuser.following_user_id_list.should == [@testuser_2.username]
      @testuser_3.following.should == []
      @testuser_3.all_following.should == []
    end

    it "should list all of the users following a user" do
      @testuser.followers.first.should == @testuser_2
      @testuser.all_followers.first.should == @testuser_2.id.to_i
      @testuser.follower_user_id_list.should include(@testuser_2.id.to_i)
      @testuser_3.followers.should == []
      @testuser_3.all_followers.should == []
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
      @lotsa_info.user_avatar_url.should be_a Hashie::Mash
      @lotsa_info.s3_user_avatar_url.should be_a Hashie::Mash
      @lotsa_info.to_param.should == "testuser-lotsainfo"
      @lotsa_info.website_url.should == "http://www.youversion.com"
      @lotsa_info.website_human.should == "youversion.com"
      @lotsa_info.name.should == "foo bar"
      @lotsa_info.zip_code.should == "78759"
      @lotsa_info.zip.should == "78759"
      @lotsa_info.configuration.should have_key(:highlight_colors)

    end
  end

  describe "avatars" do
    it "should upload a new avatar" do
      @file = ActionDispatch::Http::UploadedFile.new({
        :filename => 'catstronaut.jpg',
        :type => 'image/png',
        :tempfile => File.new("#{Rails.root}/spec/models/fixtures/files/catstronaut.jpg")
  })
    end
  end

  describe "notifications token" do
    it "should find a notification token" do
      @testuser.notifications_token.should be_a String
    end
  end

  describe "user content" do
    before :all do
      @busy_user = ensure_user
      @boring_user = ensure_user
      Note.new({title: "My New Note", content: "Some Content", reference: "gen.2.1.kjv", user_status: "public", auth: @busy_user.auth }).save
      Bookmark.new({auth: @auth, references: "matt.1.3.esv,matt.1.4.esv,matt.1.10.esv", title: "Begettings", username: @busy_user.auth}).save
      ### TODO
      ### FIXME
      ### Won't take a device_id as of API 3.
      dev = Device.new({vendor: "Apple", model: "iPhone 5", os: "iOS 6", auth: @busy_user.auth})
      dev.save
      @busy_user = connect_facebook(@busy_user)

    end

    it "should list recent activity" do
      @busy_user.recent_activity.should be_an Array
      @busy_user.recent_activity.first.class.should be_in [Note, Bookmark, Badge]
      @boring_user.recent_activity.should == []
    end

    it "should list notes" do
      @busy_user.notes.should be_a ResourceList
      @boring_user.notes.should == []
    end

    it "should list bookmarks" do
      @busy_user.bookmarks.should be_a ResourceList
      @boring_user.bookmarks.should == []
    end

    it "should list likes" do
      Like.new(note_id: @busy_user.notes.first.id, auth: @testuser.auth).save
      @testuser.likes.first.should be_a Like
    end

    it "should list devices" do
      @busy_user.devices.first.should be_a Device
    end

    it "should list connections" do
      @busy_user.connections["facebook"].should_not be_nil
    end

    it "should give a timezone" do
      @busy_user.utc_date_offset.should_not be_nil
    end

    it "should return highlight colors" do
      @busy_user.highlight_colors.should be_an Array
    end
  end


  # describe "highlight colors" - move to highlight.rb?

end
