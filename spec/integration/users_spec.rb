require 'spec_helper'

feature "Users", js: true do
	before :all do
		@user = ensure_user
		visit profile_path
	end

	before :each do
		# not sure why this has to be in :each and not :all
		# maybe a race condition?
		sign_in_user! @user
	end

	scenario "editing profile" do
		visit profile_path
		page.find("article h1").text.should eq "Settings"
		page.fill_in "user_first_name", with: "user_first_#{@random_string}"
		page.fill_in "user_last_name", with: "user_last_#{@random_string}"
		page.fill_in "user_bio", with: "user_bio_#{@random_string}"
		page.fill_in "user_location", with: "user_location_#{@random_string}"
		page.fill_in "user_postal_code", with: "user_postal_code_#{@random_string}"
		page.fill_in "user_website", with: "user_website_#{@random_string}"
		page.find("#user_country").select("United States")
		page.find("#user_timezone").select("Central Time (US & Canada) (GMT -6)")
		page.find("#user_language_tag").select("German (allemand)")
		page.find("input[name='commit']").click

		page.find("#user_first_name").value.should eq "user_first_#{@random_string}"
		page.find("#user_last_name").value.should eq "user_last_#{@random_string}"
		page.find("#user_bio").value.should eq "user_bio_#{@random_string}"
		page.find("#user_location").value.should eq "user_location_#{@random_string}"
		page.find("#user_postal_code").value.should eq "user_postal_code_#{@random_string}"
		page.find("#user_website").value.should eq "user_website_#{@random_string}"
		page.find("#user_country").value.should eq "US"
		page.find("#user_timezone").value.should eq "America/Chicago"
		page.find("#user_language_tag").value.should eq "de"
	end

	scenario "changing email to a valid address" do
		visit update_email_path
		fill_in "user_email", with: "testusercb+#{@random_string}@gmail.com"
		page.find("input[name='commit']").click
		page.find("article p").text.should eq "Please check your email and click the link to confirm your new email address."
	end

	scenario "changing email to an invalid address" do
		visit update_email_path
		fill_in "user_email", with: "testusercb@gmail.com"
		page.find("input[name='commit']").click
		page.find("div.form_errors ul li:first-child").text.should eq "An account is already registered with that email"
	end

	scenario "successfully changing password" do
		@temp_user = ensure_user
		sign_in_user! @temp_user
		visit password_path
		fill_in "user_old_password", with: @user.auth.password
		fill_in "user_password", with: "tenders22"
		fill_in "user_confirm_password", with: "tenders22"
		page.find("input[name='commit']").click
		page.find("div.flash_notice").text.should eq "Success! You've updated your password."
		# let's be nice and set it back
		@temp_user.auth.password = "tenders22"
		@temp_user.update_password(password: "tenders", confirm_password: "tenders").should_not be_false
	end

	scenario "unsuccessfully changing password" do
		@temp_user = ensure_user
		sign_in_user! @temp_user
		visit password_path
		fill_in "user_old_password", with: "notmypassword"
		fill_in "user_password", with: "tenders22"
		fill_in "user_confirm_password", with: "tenders22"
		page.find("input[name='commit']").click
		page.find("div.flash_error").text.should eq "Sorry, you'll need to enter your old password correctly to change your password."
	end
	
	scenario "changing picture" do
		pending "todo"
	end

	scenario "updating notifications" do
		visit notifications_path
		# a handy hack to get the first checked notification
		str = %w{ badges follower newsletter note_like reading_plans partners }.select do |s|
			begin
				@sel = "label.faux_checkbox.is_checked[for='notification_settings_#{s}']"
				@el = page.find(@sel)
			rescue
				false
			end
		end
		expect { @el = page.find(@sel)}.to_not raise_error
		@el.click
		page.find("button.action_button_green[action='submit']").click
		expect { page.find(sel)}.to raise_error
	end

	scenario "connecting/disconnecting accounts" do
		pending "todo"
	end

	scenario "removing coneected devices" do
		Device.new({vendor: "Apple", model: "iPhone 6", os: "iOS 7", device_id: "1232313323314", auth: @user.auth}).save.should
		visit devices_path
		page.find("ul.big_list li h4").text.should eq "Apple Iphone 6" # argh, come on guys
		page.find("ul.big_list li div.confirm a").click
		page.find("ul.big_list li div.danger a").click
		page.should_not have_content "Apple Iphone 6"
	end

	scenario "deleting account" do
		visit delete_account_path
		fill_in "password", with: @user.auth.password
		page.find("input[name='commit']").click
		page.find("input.danger[name='commit']").click
		page.find("article p").text.should include("Your YouVersion account has been successfully deleted")
	end


end
