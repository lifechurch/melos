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
              { user_id: @testuser23.id,
                username: "testuser23",
                password: "tenders"
              } )
  end

  describe ".find" do
    it 'returns Bookmark object with valid param' do
      bk = Bookmark.new({auth: @auth, version: "esv", reference: "Matt.1.1", title: "Begettings", username: @testuser23.username})
      bk.save
      @bookmark = Bookmark.find(bk.id)
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
      bookmark = Bookmark.new({auth: @auth, version: "esv", reference: "Matt.1.1", title: "Begettings", username: @testuser23.username})
      bookmark.save.should_not be_false
      bookmark_b = Bookmark.new({auth: @auth, version: "esv", reference: "Matt.1.3+Matt.1.4+Matt.1.10", title: "Begettings", username: @testuser23.username})
      bookmark_b.save.should_not be_false
      bookmark_b.reference.should be_an Array
      bookmark_b.reference.first.should be_a Reference
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
                               reference: "Matt.10.1", title: "UpdateMe", username: @testuser23.username})
      bookmark.save.should_not be_false
      bookmark.persisted?.should be_true

      response = bookmark.update(title: "New Title", labels: "cats,dogs", hightlight_color: 'ffcc00' )

      response.should be_true

      bookmark = Bookmark.find bookmark.id
      puts bookmark.inspect

      bookmark.title.should == "New Title"
      bookmark.labels.should == "cats, dogs"
      bookmark.highlight_color.should == "ffcc00"
    end
  end

  describe ".destroy" do
    it 'destroys a bookmark and returns the correct response' do
      bookmark = Bookmark.new({auth: @auth, version: "esv",
                               reference: "Matt.10.1", title: "DeleteMe", username: @auth.username})
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
  describe ".labels_for_user" do
    it "returns a list of labels for a user" do
      bookmark = Bookmark.new(auth: @auth, version: "esv", reference: "Matt.10.1", title: "I have lots of labels", labels: "alpha,beta,gamma", username: @auth.username)
      bookmark.save.should be_true
      labels = Bookmark.labels_for_user @auth.user_id
      labels.labels.first.should be_a Hashie::Mash
      puts labels.labels
      labels.labels.detect { |l| l.label == "alpha" }.should_not be_nil
      labels.labels.detect { |l| l.label == "beta" }.should_not be_nil
    end
  end
end
