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

  describe ".save" do
    it "returns true for saving valid params" do
      bookmark = Bookmark.new({auth: @auth, reference: "matt.1.3.esv,matt.1.4.esv,matt.1.10.esv", title: "Begettings", username: @testuser23.username})
      bookmark.save.should_not be_false
      bookmark.reference_list.should be_a ReferenceList
      bookmark.reference_list.first.osis.should == "matt.1.3.esv"
    end

    it "returns false for invalid params" do
      bad_bookmark = Bookmark.new({reference: "matt.99", auth: @auth})
      bad_bookmark.save.should be_false
      bad_bookmark.errors.count.should == 1
    end
  end

  describe ".find" do
    it 'returns Bookmark object with valid param' do
      bk = Bookmark.new({auth: @auth, reference: "matt.1.1.esv", title: "Begettings"})
      bk.save
      bookmark = Bookmark.find(bk.id)
      bookmark.title.should == 'Begettings'
      bookmark.labels.should be_nil
      bookmark.reference_list.should be_a ReferenceList
      bookmark.reference_list.first.should be_a Reference
    end

    it 'raises an exception if Bookmark was not found' do
      lambda { Bookmark.find('99999999999999') }.should raise_error(YouVersion::ResourceError, 'not_found')
    end
  end


  describe ".update" do
    it 'updates a Bookmark and returns the correct response' do
      bookmark = Bookmark.new({auth: @auth, reference: "matt.10.1.esv", title: "UpdateMe"})
      bookmark.save.should_not be_false
      bookmark.persisted?.should be_true

      response = bookmark.update(title: "New Title", labels: "cats,dogs", highlight_color: 'ffcc00' )

      response.should be_true

      bookmark = Bookmark.find bookmark.id

      bookmark.highlight_color.should == "ffcc00"
      bookmark.title.should == "New Title"
      bookmark.labels.should == "cats, dogs"
    end
  end

  describe ".destroy" do
    it 'destroys a bookmark and returns the correct response' do
      bookmark = Bookmark.new({auth: @auth, reference: "matt.10.1.esv", title: "DeleteMe"})
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

  end

  describe ".labels_for_user" do
    it "returns a list of labels for a user" do
      bookmark = Bookmark.new(auth: @auth, version: "esv", reference: "matt.10.1", title: "I have lots of labels", labels: "alpha,beta,gamma", username: @auth.username)
      bookmark.save.should be_true
      labels = Bookmark.labels_for_user @auth.user_id
      labels.first.should be_a Hashie::Mash
      labels.detect { |l| l.label == "alpha" }.should_not be_nil
      labels.detect { |l| l.label == "beta" }.should_not be_nil
    end
  end
end
