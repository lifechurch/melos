require 'spec_helper'

describe TwitterConnection do

	before :each do
		# These are hardcoded because OAuth testing is ridiculous
		@creds_1 = {username: "twitter_test1", password: "tenders"}
		@creds_2 = {username: "twitter_test2", password: "tenders"}
		@user_1 = User.authenticate(@creds_1[:username], @creds_1[:password])
		@user_2 = User.authenticate(@creds_2[:username], @creds_2[:password])
		# Twitter accounts are yv_test1, tenders and yv_test2, tenders
		# @attributes_1 = {:oauth_token=>"608693798-KEuDBKFNqgzlY6XaQ11U1I3brqn9i0AnNTZ3fKKy", :oauth_token_secret=>"B5kOh3zQuZL64CzCVY2mJRh5GZShpNxzqbQJ844V4U", :user_id=>"608693798", :screen_name=>"yv_test1", :key=>"HhYNsW1KCxFH5WeCQ3nRXQ", :secret=>"LppBTdEyoJ3ASfPqxHz97IDW5UxpXVim2DbrqdJSrTI"}
		# @attributes_2 = {:oauth_token=>"608694587-8zcgKFCLeJUeclZlQ7UlQ9uz48Ds47gg6t3qHM22", :oauth_token_secret=>"PYkLJUZ3bBwkOi02ecmtctkEzQrQtv5QlGlkB5td4", :user_id=>"608694587", :screen_name=>"yv_test2", :key=>"HhYNsW1KCxFH5WeCQ3nRXQ", :secret=>"LppBTdEyoJ3ASfPqxHz97IDW5UxpXVim2DbrqdJSrTI"}

		@attributes_1 = {
			credentials: {
				"token" => "608693798-KEuDBKFNqgzlY6XaQ11U1I3brqn9i0AnNTZ3fKKy",
				"secret" => "B5kOh3zQuZL64CzCVY2mJRh5GZShpNxzqbQJ844V4U"
			},
			uid: "608693798",
			info: {
				"nickname" => "yv_test1"
			},
			auth: @user_1.auth
		}

		@attributes_2 = {
			credentials: {
				"token" => "608694587-8zcgKFCLeJUeclZlQ7UlQ9uz48Ds47gg6t3qHM22",
				"secret" => "PYkLJUZ3bBwkOi02ecmtctkEzQrQtv5QlGlkB5td4"
			},
			uid: "608694587",
			info: {
				"nickname" => "yv_test2"
			},
			auth: @user_2.auth
		}
	end

	it "connects to twitter" do
		begin
			@user_1.connections["twitter"].delete
			@user_2.connections["twitter"].delete
		rescue
		end
		@user_1 = User.authenticate(@creds_1[:username], @creds_1[:password])
		@user_2 = User.authenticate(@creds_2[:username], @creds_2[:password])
		conn_1 = TwitterConnection.new(@attributes_1)
		conn_2 = TwitterConnection.new(@attributes_2)
		conn_1.save.should be_true
		conn_2.save.should be_true
	end

	it "disconnects from twitter" do
		begin
			conn_1 = TwitterConnection.new(@attributes_1)
			conn_2 = TwitterConnection.new(@attributes_2)
			conn_1.save
			conn_2.save
		rescue
		end
			@user_1 = User.authenticate(@creds_1[:username], @creds_1[:password])
			@user_2 = User.authenticate(@creds_2[:username], @creds_2[:password])

			@user_1.connections["twitter"].delete.should be_true
			@user_2.connections["twitter"].delete.should be_true
	end

	it "finds friends on twitter" do
		begin
			conn_1 = TwitterConnection.new(@attributes_1)
			conn_2 = TwitterConnection.new(@attributes_2)
			conn_1.save
			conn_2.save
		rescue
		end
		@user_1 = User.authenticate(@creds_1[:username], @creds_1[:password])
		@user_2 = User.authenticate(@creds_2[:username], @creds_2[:password])

		@user_1.connections["twitter"].find_friends.first.should == @user_2
	end
end