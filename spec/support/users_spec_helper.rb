module UsersSpecHelper
	def ensure_user(opts = {})
		@random_string = rand(10000000).to_s
		opts[:username] ||= "testuser#{@random_string}"
		opts[:password] ||= 'tenders'
		begin
			user = User.authenticate(opts[:username], opts[:password])
			user.destroy
		rescue
		end
		opts = {email: "#{opts[:username]}@youversion.com", agree: true, language_tag: "en", verified: true, locale: "en_US"}.merge opts
		response = User.register(opts)
		begin
			user = User.authenticate(opts[:username], opts[:password])
		rescue
			sleep 10
			user = User.authenticate(opts[:username], opts[:password])
		end
		user.should be_a User
		user
	end

	def ensure_users(opts = [])
		opts.each { |u| ensure_user u }
	end

	def destroy_user(opts = {})
		begin
			user = User.authenticate(opts[:username], opts[:password])
			user.destroy
		rescue
		end
	end


	def sign_in_user!(user = nil)
		visit sign_out_path
		user ||= @user
		visit sign_in_path
		page.fill_in "username", with: user.username # or whoever
		page.fill_in "password", with: user.auth.password
		page.find("button[type='submit']").click
	end
end

#allows cucumber access to these helpers
World(UsersSpecHelper) if respond_to?(:World)
