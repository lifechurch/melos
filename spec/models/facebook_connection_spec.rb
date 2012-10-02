require 'spec_helper'
require 'ruby-debug'

describe FacebookConnection do

	subject { ensure_user(email: "testuser59@gmail.com", username: "testuser59", password: "tenders") }

	it "should add connection info to the API when saved" do
		@user = subject
		@user.connections["facebook"].should be_nil
		@user = connect_facebook(@user)
		# force reload
		@user.connections["facebook"].should_not be_nil
	end

	it "lists a user's Facebook friends on YouVersion" do
		@user_1 = subject
		@user_2 = ensure_user(email: "testuser60@gmail.com", username: "testuser60", password: "tenders")
		@user_1 = connect_facebook(@user_1)
		@user_2 = connect_facebook(@user_2)
		make_facebook_friends(@user_1, @user_2)
		@user_1.connections["facebook"].find_friends.should have(1).user
	end
	
	it "deletes a user's connection info" do
		@user = subject
		@user = connect_facebook(@user)
		# force reload
		@user.connections["facebook"].should_not be_nil
		@user.connections["facebook"].delete
		# force reload
		@user = User.authenticate(subject.username, "tenders")
		@user.connections["facebook"].should be_nil
	end
	
	it "updates the expiration date of a user token" do
		@user = connect_facebook(subject)
		@user.connections["facebook"].update_token
		@user = User.authenticate(subject.username, "tenders")
		@user.connections["facebook"].update_token.should_not be_false
	end
end