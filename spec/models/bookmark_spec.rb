require 'spec_helper'

describe Bookmark do
  # use_vcr_cassette "bookmark"
  before :all do
    @testuser23 = ensure_user({ email: "testuser23@youversion.com",
               username: "testuser23",
               password: "tenders",
               agree: TRUE,
               verified: TRUE,
               locale: "en_US" })
    @auth = Hashie::Mash.new(
              { id: @testuser23.id,
                username: "testuser23",
                password: "tenders"
              } )
  end

  describe ".find" do
    it 'returns Bookmark object with valid param' do
      bookmark_id = Bookmark.new({auth: @auth, version: "esv",
                               reference: "Matt.1.1", title: "Begettings", username: @testuser23.username}).save.id
      @bookmark = Bookmark.find(bookmark_id)
      @bookmark.title.should == 'Begettings'
      @bookmark.labels.should be_nil
      @bookmark.reference.osis.should == 'Matt.1.1'
    end

    it 'raises an exception if Bookmark was not found' do
      lambda { Bookmark.find('99999999999999') }.should raise_error(YouVersion::ResourceError, 'not_found')
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
      bookmark = Bookmark.new({auth: @auth, version: "esv",
                               reference: "Matt.1", title: "Begettings", username: @testuser23.username})
      bookmark.save.should_not be_false
    end

    it "returns false for invalid params" do
      bad_bookmark = Bookmark.new({reference: "Matt.99", auth: @auth})
      bad_bookmark.save.should be_false
      bad_bookmark.errors.count.should == 1
    end
  end

  describe ".update" do
    it 'updates a Bookmark and returns the correct response' do
      bookmark = Bookmark.new({auth: @auth, version: "esv",
                               reference: "Matt.19.1", title: "UpdateMe", username: @testuser23.username})
      bookmark.save.should_not be_false
      bookmark.persisted?.should be_true

      response = bookmark.update(title: "New Title")

      response.should be_true

      bookmark = Bookmark.find bookmark.id

      bookmark.title.should == "New Title"
    end
  end

  describe ".destroy" do
    it 'destroys a bookmark and returns the correct response' do
      bookmark = Bookmark.new({auth: @auth, version: "esv",
                               reference: "Matt.19.1", title: "DeleteMe", username: @auth.username})
      bookmark.save.should_not be_false
      bookmark.persisted?.should be_true

      response = bookmark.destroy
      response.should be_true
    end
  end

  describe '.for_user' do
    it "returns a ResourceList" do
      bookmarks = Bookmark.for_user(@testuser23.id)
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
