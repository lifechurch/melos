module ConnectionsSpecHelper
	def connect_facebook(user)
		# connects a fake facebook test account.
		@test_users_api = Koala::Facebook::TestUsers.new(:app_id => Cfg.facebook_app_id, :secret => Cfg.facebook_secret)
		@fb_user_info = @test_users_api.create(true, "offline_access,read_stream,publish_stream")
		@fb_user = Koala::Facebook::API.new(@fb_user_info["access_token"]).get_object("me")
		@connection_info = Hashie::Mash.new({
			info: {
				"name" => @fb_user["name"],
				"nickname"=> @fb_user["name"]
			},
			uid: @fb_user["id"],
			credentials: {"token" => @fb_user_info["access_token"]},
			auth: Hashie::Mash.new(username: user.username, password: "tenders", user_id: user.id)
			})
		@connection = FacebookConnection.new(@connection_info)
		@connection.save.should be_true
		User.authenticate(user.username, "tenders")
	end

	def make_facebook_friends(user_1, user_2)
		@test_users_api = Koala::Facebook::TestUsers.new(:app_id => Cfg.facebook_app_id, :secret => Cfg.facebook_secret)
		user_1_hash = {id: user_1.connections["facebook"].data[:user_id], access_token: user_1.connections["facebook"].data[:access_token]}
		user_2_hash = {id: user_2.connections["facebook"].data[:user_id], access_token: user_2.connections["facebook"].data[:access_token]}
		@test_users_api.befriend(user_1_hash, user_2_hash)
	end
end