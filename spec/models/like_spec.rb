require 'spec_helper'

describe Like do
	before :all do
		@user_1 = ensure_user
		@user_2 = ensure_user
    @valid_attributes = {title: "My New Note", content: "Some Content", reference: "gen.2.1.asv", user_status: "public", auth: @user_1.auth }
    @note = Note.new(@valid_attributes)
    @note.save
	end

	it "should create a like" do
		like = Like.new(note_id: @note.id, auth: @user_2.auth)
		like.save.should be_true
	end

	it "should list a user's likes" do
		@user_2.likes.should be_a ResourceList
		@user_2.likes.first.should be_a Like
		@user_2.likes.first.note.should be_a Note
		@user_1.likes.should == []
	end
end
