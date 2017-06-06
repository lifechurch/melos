require 'spec_helper'

describe Device do
	before :all do
		@user = ensure_user
		@user_2 = ensure_user
	end

	describe "adding a device" do
		it "should add a device" do
			Device.new({vendor: "Apple", model: "iPhone 5", os: "iOS 6", device_id: "1232313323314", auth: @user.auth}).save.should
			@user.devices.first.created_date.should be_a Date
		end
	end

	describe "removing a device" do
		before do
			Device.new({vendor: "Apple", model: "iPhone 5", os: "iOS 6", device_id: "1232313323314", auth: @user_2.auth}).save.should
		end

		it "should remove an existing device" do
			@user_2.devices.first.destroy.should
		end
	end

	describe "some path helpers" do
		it "should have some helper methods for handy API paths" do
			Device.resource_path.should == "users/view_device"
			Device.update_path.should == "users/set_device"
			Device.delete_path.should == "users/delete_device"
		end
	end
	
end