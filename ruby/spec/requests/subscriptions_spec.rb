require 'spec_helper'

describe "Subscriptions, while not logged in" do
	describe "show a users plans" do
		it "should require login first" do
      		visit "/users/BrittTheIsh/reading-plans"
      		page.current_path.should == sign_up_path
    	end
	end
end

describe "Subscriptions, while logged in" do
	before(:all) do
		@user = ensure_user
	end

	before(:each) do
		sign_in_user! @user
	end

	it "should show my plans to me" do
		visit "/users/#{@user.username}/reading-plans"
		page.has_no_css?("ul.resource_list")
		page.status_code.should == 200
	end

	it "should let me subscribe to a plan" do
		my_plans_url = "/users/#{@user.username}/reading-plans"
		visit(my_plans_url)
		page.should_not have_content("Wisdom")
		
		visit "/reading-plans/45-wisdom"
		click_link("Start This Plan")

		visit(my_plans_url)
		page.should have_content("Wisdom")
	end

	describe "subscribed to a plan" do
		
		before(:all) do
			visit "/reading-plans/45-wisdom"
			click_link("Start This Plan")
		end

		it "should allow me to view plan settings page" do
			plan_url = "/users/#{@user.username}/reading-plans/45-wisdom"
			visit(plan_url)

			within(sidebar_selector) do
				page.should have_link("Settings")
				click_link("Settings")
			end

			within(sidebar_selector) do
				page.should have_content("Settings")
				page.should have_link("Calendar")
				page.should have_link("Settings")
				page.should have_link("View Today's Reading")
				page.should have_content("Publisher")
			end
		end

		it "should allow me to view plan calendar page" do
			plan_url = "/users/#{@user.username}/reading-plans/45-wisdom"
			visit(plan_url)
			within(sidebar_selector) do
				page.should have_link("Calendar")
				click_link("Calendar")
			end

			within(sidebar_selector) do
				page.should have_content("Calendar")
				page.should have_link("Calendar")
				page.should have_link("Settings")
				page.should have_link("View Today's Reading")
				page.should have_content("Publisher")
			end			
		end
	end
end


# Externalize any css selectors that could change overtime.
def sidebar_selector
	"#sidebar"
end