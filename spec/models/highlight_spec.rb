require 'spec_helper'

describe Highlight do
	before :all do
		@user = ensure_user
	end

	it "should create a new highlight" do
		hgh = Highlight.new({color: "ff0000", reference: "matt.1.1.esv", auth: @user.auth}).save.should be_true
	end

end