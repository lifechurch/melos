require 'spec_helper'

feature "Pages", js: true do

  describe "visiting home page" do
    scenario "visiting home page" do
      visit root_path
      page.should have_content "A free Bible on your phone"
      page.should have_content "God's Word is with you"
    end
  end
end
