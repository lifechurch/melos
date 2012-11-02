require 'spec_helper'

feature "Reader", js: true do
	describe "when signed out" do
		before :all do
			visit "/sign-out"
		end

		scenario "selecting verses" do
			# WHen I visit a Bible chapter page
			visit "/bible/1/jhn.1.kjv"
			# Then I should not see the verse actions button
			page.find("li#li_selected_verses").should_not be_visible
			# When I click a verse
			page.find("span.verse.v1").click
			# I should see the selected verses badge
			page.find("li#li_selected_verses").should be_visible
			page.find("sup#verses_selected_count").should have_content("1")
			# And I should see a verse token in the dropdown menu
			page.all("#menu_bookmark ul.reference_tokens li").first.should have_content("John 1:1")
			# When I click a different verse
			page.find("span.verse.v3").click
			# Then I should see the count go u
			page.find("sup#verses_selected_count").should have_content("2")
			# And there should be another token
			page.all("#menu_bookmark ul.reference_tokens li").first.should have_content("John 1:1")
			page.all("#menu_bookmark ul.reference_tokens li").second.should have_content("John 1:3")
			# When I click a previously selected verse to unselect it
			page.find("span.verse.v3").click
			# Then the count should go back down
			page.find("sup#verses_selected_count").should have_content("1")
			page.find("span.verse.v3").click
			page.find("sup#verses_selected_count").should have_content("2")
			page.all("#menu_bookmark ul.reference_tokens li").second.should have_content("John 1:3")
			# When I click a token
			page.all("#menu_bookmark ul.reference_tokens li").second.find("a").click
			# Then it should unselect that verse
			page.find("sup#verses_selected_count").should have_content("1")
			# And the token should disappear
			page.all("#menu_bookmark ul.reference_tokens li").count.should == 1
		end

	end

	describe "when signed in" do
		before :all do
			# Given I am signed in as "testusercb" with the password "tenders"
		end
		describe "with selected verses" do
			before :each do
				# Given I an on the chapter page for KJV John 1
				visit "/bible/1/jhn.1.kjv"
				visit "/sign-in"
				page.fill_in "username", with: "testusercb" # or whoever
				page.fill_in "password", with: "tenders"
				page.find("input[name='commit']").click
				# And I have selected verse 1
				visit "/bible/1/jhn.1.kjv"
				page.find("span.verse.v1").click
			end

			scenario "highlighting a verse" do
				puts "im on #{current_path}"
				page.find("#highlight_0").click
				puts "now im on #{current_path}"
				page.find("#version_primary span.verse.v1.highlighted").should


			end
				

		end
	end

end
