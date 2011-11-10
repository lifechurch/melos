require 'spec_helper'

describe Bookmark do
  use_vcr_cassette "bookmark"
  before :all do
    @params = { email: "testuser23@youversion.com",
               username: "testuser23",
               password: "tenders",
               agree: TRUE,
               verified: TRUE,
               locale: "en_US" }
    @auth = Hashie::Mash.new(
              { id: 4163177,
                username: "testuser",
                password: "tenders"
              } )
  end

  describe ".find" do
    it 'returns Bookmark object with valid param' do
      @bookmark = Bookmark.find('21699565')
      @bookmark.title.should == 'Begettings'
      @bookmark.labels.should be_nil
      @bookmark.reference.osis.should == 'Matt.1.1'
    end

    it 'raises an exception if Bookmark was not found' do
      Bookmark.find('0').should raise_error(ResourceError, "API Error: Version is invalid")
    end
  end

  describe ".save" do
    before(:all) do
      @user = User.new(@params)
      puts "User is #{@user.inspect}"
      @user.create.should_not be_false
      @new_auth = Hashie::Mash.new({id: @user.id, username: @user.username, password: @user.password})
    end

    it "returns true for saving valid params" do
      # This is really brittle, because in the initial call (where we create our VCR cassette),
      # this user has to be a valid user on the remote system. So that means we have to create
      # the cassette with a new user, so that the first time, the user we expect is created.
      # We could theoretically have a cassette somewhere with some real, existing users already
      # in it, one that we knew existed on the remote system. But this would likewise be quite
      # brittle. I don't have an answer, just making a note next time I'm through here and
      # wondering why a spec that used to pass has started failing or something.
      bookmark = Bookmark.new({auth: @new_auth, version: "esv",
                               reference: "Matt.1", title: "Begettings", username: @user.username})
      bookmark.save.should_not be_false
    end

    it "returns false for invalid params" do
      bad_bookmark = Bookmark.new({reference: "Matt.99", auth: @new_auth})
      bad_bookmark.save.should be_false
      bad_bookmark.errors.count.should == 1
    end

    after(:all) do
      #      @user.destroy
    end
  end

  describe ".update" do
    it 'updates a Bookmark and returns the correct response' do
      bookmark = Bookmark.new({auth: @auth, version: "esv",
                               reference: "Matt.19.1", title: "UpdateMe", username: @auth.username})
      bookmark.save.should_not be_false
      bookmark.persisted?.should be_true

      response = bookmark.update(title: "New Title", reference: "luke.1.1", version: 'kjv' )

      response.should be_true

      bookmark = Bookmark.find bookmark.id

      bookmark.title.should == "New Title"
      bookmark.version.should == "kjv"
      bookmark.reference.should == "luke.1.1"
    end
  end

  describe ".destroy" do
    it 'destroys a bookmark and returns the correct response' do
      bookmark = Bookmark.new({auth: @auth, version: "esv",
                               reference: "Matt.19.1", title: "DeleteMe", username: @auth.username})
      bookmark.save.should_not be_false
      bookmark.persisted?.should be_true

      response = bookmark.destroy(@auth)
      response.should be_true
    end
  end

  describe '.for_user' do
    it "returns a ResourceList" do
      user = User.new(@params)
      user.create.should_not be_false
      bookmarks = Bookmark.for_user(user.id)
      bookmarks.should be_a ResourceList
    end

    it "returns empty ResourceList for invalid params" do
      bookmarks = Bookmark.for_user(0)
      bookmarks.size.should == 0
    end

    it "creates Bookmark objects for valid param" do
      bookmarks = Bookmark.for_user(99)
      bookmarks.total.should > 0
      bookmarks.first.should be_a Bookmark
    end
  end
end
