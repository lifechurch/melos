require 'spec_helper'

describe Highlight do
	before :all do
		@user = ensure_user
	end

	it "should create a new highlight" do
		hgh = Highlight.new({color: "ff0000", reference: "matt.1.1.esv", auth: @user.auth}).save.should be_true
	end

	it "should list a user's highlights" do
		hgh = Highlight.new({color: "ff0000", reference: "matt.1.2.esv", auth: @user.auth}).save.should be_true
		Highlight.for_reference("matt.1.2.esv", auth: @user.auth).should be_a ResourceList
	end

	it "should return itself as json" do
		hgh = Highlight.new({color: "ff0000", reference: "matt.1.3.esv", auth: @user.auth}).save.should be_true
		Highlight.for_reference("matt.1.3.esv", auth: @user.auth).as_json.first[:color].should == "ff0000"
	end
end