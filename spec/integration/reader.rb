require 'spec_helper'

feature "Reader", js: true do
	scenario "selecting verses" do
		visit "/bible/1/jhn.1.kjv"
		page.find("li#li_selected_verses").should_not be_visible
		# click a verse
		page.find("span.verse.v1").click
		# should see selected verses badge
		page.find("li#li_selected_verses").should be_visible
		page.find("sup#verses_selected_count").should have_content("1")
		# should create a verse token
		page.all("#menu_bookmark ul.reference_tokens li").first.should have_content("John 1:1")
		# click a different verse
		page.find("span.verse.v3").click
		page.find("sup#verses_selected_count").should have_content("2")
		page.all("#menu_bookmark ul.reference_tokens li").first.should have_content("John 1:1")
		page.all("#menu_bookmark ul.reference_tokens li").second.should have_content("John 1:3")
		# click a previously selected verse
		page.find("span.verse.v3").click
		page.find("sup#verses_selected_count").should have_content("1")

	end
end
