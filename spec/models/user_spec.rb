require 'spec_helper'

describe User do
  before :all do
    # ensure_user({username: "testusercb111", password: "tenders"})
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
      expect(User.authenticate("testuser999", @test_creds[:password])).to(respond_to(:errors))
      result = User.register(email: "testuser999@youversion.com", username: "testuser999", password: @test_creds[:password], agree: true, verified: true)
      result.should be_true
    end

    it 'makes a bunch of users', :focus  do
      # 1.upto(10).each do |n|
      #   puts destroy_user({username: "webtest#{n}", password: 'passverd'})
      # end

      # 10.upto(15).each do |n|
      #   result = User.register(email: "webtest#{n}@youversion.com", username: "webtest#{n}", password: 'passverd', agree: true, verified: true, first_name: 'greatest', last_name: 'ever')
      #   puts result.inspect
      # end
# matt 7830
# hugh 7648
      10.upto(15) do |n|
        # test_user = User.authenticate("webtest#{n}", "passverd")
        # puts Friendships.offer(user_id: 7830, auth: test_user.auth).inspect
        # user = User.authenticate("matt", "staging")
        # puts Friendships.decline(user_id: test_user.id, auth: user.auth).inspect
      end


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

  describe "#change_password" do
    it "should work with a valid old password" do
      @user = ensure_user
      @user.update_password(password: "tenders2", confirm_password: "tenders2").should_not be_false
    end
  end

  describe "configuration" do; end

  describe "profile" do
    # Test:
    # user_avatar_url
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
      @busy_user = ensure_user({username: "testusercb", password: "tenders", email: "testusercb@gmail.com"})
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

    it "should list notes" do
      @busy_user.notes.should be_a ResourceList
      @boring_user.notes.should == []
    end

    it "should list bookmarks" do
      @busy_user.bookmarks.should be_a ResourceList
      @boring_user.bookmarks.should == []
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
