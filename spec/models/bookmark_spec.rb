require 'spec_helper'

describe Bookmark do
  before :all do
    @user = ensure_user
    @auth = @user.auth
  end

  describe ".save" do
    it "should save a valid bookmark" do
      bookmark = Bookmark.new({auth: @auth, references: "matt.1.3.kjv,matt.1.4.kjv,matt.1.10.kjv", title: "Begettings", username: @user.username})
      bookmark.save.should_not be_false
      bookmark.reference_list.should be_a ReferenceList
      bookmark.reference_list.first.should == Reference.new("matt.1.3.kjv")
    end

    it "should return false for an invalid bookmark" do
      bad_bookmark = Bookmark.new({references: "matt.99", auth: @auth})
      bad_bookmark.save.should be_false
      bad_bookmark.errors.count.should == 1
    end
  end

  describe ".find" do
    it 'should find a bookmark by id' do
      bk = Bookmark.new({auth: @auth, references: "matt.1.1.kjv", title: "Begettings"})
      bk.save
      bookmark = Bookmark.find(bk.id)
      bookmark.title.should == 'Begettings'
      bookmark.labels.should be_nil
      bookmark.user_id.should == @user.id
      bookmark.reference_list.should be_a ReferenceList
      bookmark.reference_list.first.should be_a Reference
    end

    it 'should raise an exception if a bookmark is not found by ID' do
      lambda { Bookmark.find('99999999999999') }.should raise_error(YouVersion::ResourceError, 'not_found')
    end
  end


  describe ".update" do
    it 'should update a bookmark' do
      bookmark = Bookmark.new({auth: @auth, references: "matt.10.1.kjv", title: "UpdateMe"})
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
    it 'should delete a bookmark' do
      bookmark = Bookmark.new({auth: @auth, references: "matt.10.1.kjv", title: "DeleteMe"})
      bookmark.save.should_not be_false
      bookmark.persisted?.should be_true

      response = bookmark.destroy
      response.should be_true
    end
  end

  describe '.for_user' do
    it "should reburn a ResourceList of bookmarks" do
      bookmarks = Bookmark.for_user(@user.id)
      bookmarks.should be_a ResourceList
    end
  end

  describe ".labels_for_user" do
    it "should return a list of labels for a user" do
      bookmark = Bookmark.new(auth: @auth, version_id: 1, references: "matt.10.1", title: "I have lots of labels", labels: "alpha,beta,gamma", username: @auth.username)
      bookmark.save.should be_true
      labels = Bookmark.labels_for_user @auth.user_id
      labels.first.should be_a Hashie::Mash
      labels.detect { |l| l.label == "alpha" }.should_not be_nil
      labels.detect { |l| l.label == "beta" }.should_not be_nil
      @user_2 = ensure_user
      Bookmark.labels_for_user(@user_2.id).should == []
    end
  end

  describe ".all" do
    it "should return all bookmarks" do
      pending "should be removed for API3, I guess?"
      Bookmark.all.should be_a ResourceList
    end
  end
  describe ".for_label" do

    it "should return all bookmarks with a given label" do
      Bookmark.for_label("alpha", user_id: @auth.user_id).should be_a ResourceList
      Bookmark.for_label("communism", user_id: @auth.user_id).should == []
    end
  end
end
