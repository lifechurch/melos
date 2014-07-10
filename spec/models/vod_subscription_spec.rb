require 'spec_helper'

describe VodSubscription do

	let (:user) {	Social.matt }

	describe "getting vod subscription" do
		it "should get", focus: true  do
			puts VodSubscription.all(auth: user.auth)
		end
	end

	describe "setting vod subscription" do
		it "should create" do
			VodSubscription.create({push: {version_id: 1, time: "06:00:00"}, email: {version_id: 1, time: "06:00:00"}, auth: user.auth, debug: false}).should
		end
	end

	describe "removing vod subscriptions" do
		it "should delete all"do
			VodSubscription.delete({push: {version_id: nil, time: nil }, email: {version_id: nil, time: nil }, auth: user.auth, debug: false}).should
		end

		it "should delete only push" do
			VodSubscription.create({push: {version_id: 1, time: "06:00:00"}, email: {version_id: 1, time: "06:00:00"}, auth: user.auth, debug: false}).should
			VodSubscription.delete({push: {version_id: nil, time: nil }, email: {version_id: 1, time: "06:00:00"}, auth: user.auth, debug: false}).should
		end
	end

	describe "some path helpers" do
		it "should have some helper methods for handy API paths" do
			VodSubscription.create_path.should == "notifications/update_votd_subscription"
			VodSubscription.delete_path.should == "notifications/update_votd_subscription"
		end
	end
	
end