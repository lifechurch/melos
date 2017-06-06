require 'spec_helper'

describe Badge do

	before :all do
		@creds = {username: "badgertest123", password: "tenders"}
		@user = User.authenticate(@creds[:username], @creds[:password])
		# Please don't run the following line of code;
		# I had to go earn badges manually.

		# ensure_user @creds
	end
	it "lists a user's badges" do
		@user.badges.first.should be_a Badge
		@user.badges.first.earned.should be_a Date
		@user.badges.first.image_url.should be_a Hash
		@user.badges.first.to_param.should be_a String
	end
end