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
  end

  describe ".find" do
    it 'returns Bookmark object with valid param' do
      @bookmark = Bookmark.find('21699565')
      @bookmark.title.should == 'Begettings'
      @bookmark.labels.should be_nil
      @bookmark.reference.osis.should == 'Matt.1.1'
    end

    it 'returns nil if Bookmark was not found' do
      @bookmark = Bookmark.find('0')
      @bookmark.should be_nil
    end
  end

  describe ".save" do
    it "returns true for saving valid params" do
      # This is really brittle, because in the initial call (where we create our VCR cassette),
      # this user has to be a valid user on the remote system. So that means we have to create
      # the cassette with a new user, so that the first time, the user we expect is created.
      # We could theoretically have a cassette somewhere with some real, existing users already
      # in it, one that we knew existed on the remote system. But this would likewise be quite
      # brittle. I don't have an answer, just making a note next time I'm through here and
      # wondering why a spec that used to pass has started failing or something.
      user = User.new(@params)
      puts "User is #{user.inspect}"
      user.create.should_not be_false
      bookmark = Bookmark.new({auth_username: user.username, auth_password: user.password, version: "esv",
                               reference: "Matt.1", title: "Begettings", username: user.username})
      bookmark.save.should_not be_false
    end

    it "returns false for invalid params" do
      bad_bookmark = Bookmark.new({reference: "Matt.99"})
      bad_bookmark.save.should be_false
      bad_bookmark.errors.count.should == 1
    end
  end

  describe ".destroy" do
    it 'destroys a bookmark and returns the correct response' do
      @auth = Hashie::Mash.new( { id: 4163177,
                 username: "testuser",
                 password: "tenders"
              } )
      bookmark = Bookmark.new({auth_username: @auth.username, auth_password: @auth.password, version: "esv",
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
