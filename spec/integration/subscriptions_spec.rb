require 'spec_helper'

def url( is = "/reading-plans/60-the-one-year-bible" )
  return is
end

def start_subscription
  visit url
  page.find("#subscription-start").click
end

def should_have_settings_sidebar
  page.find("#sidebar").should have_link("Calendar")
  page.find("#sidebar").should have_link("Settings")
  page.find("#sidebar").should have_link("View Today's Reading", :href => "#{test_user_base_url}#{url}")
end

def should_have_reader_sidebar
  page.find("#sidebar").should have_link("Calendar")
  page.find("#sidebar").should have_content("One Year")
  page.find("#sidebar").should have_link("Previous Day")
  page.find("#sidebar").should have_link("Next Day")
end

feature "Subscriptions", js: true do

  describe "when signed in" do
    before :all do
      @user = ensure_user
    end

    before :each do
      # not sure why this has to be in :each and not :all
      # maybe a race condition?
      sign_in_user! @user
    end

    describe "core actions" do

      after :each do
        visit "#{test_user_base_url}#{url}/edit"
          page.find("#subscription-destroy").click
          page.find("#subscription-destroy").value.should have_content("Yes, I'm sure")
          page.find("#subscription-destroy").click

        visit url
          page.find("#subscription-start").should be_visible
      end

      scenario "start and stop a subscription" do
        start_subscription
        visit url
          page.find("#subscription-read").should be_visible
      end


      scenario "start and visit a subscription" do
        start_subscription
        visit "#{test_user_base_url}#{url}"
          page.find("article").should be_visible
          page.find("#sb-subscription").should be_visible
          should_have_reader_sidebar
      end

      scenario "start, visit, complete and uncomplete a reading" do
        start_subscription
        visit "#{test_user_base_url}#{url}?day=1"
          list = page.find("#sb-subscription div.widget.fix ul")
          list.should have_content("Genesis 1")
          list.should have_content("Genesis 2")
          list.should have_content("Matthew 1")
          list.should have_content("Matthew 2")
          list.should have_content("Psalms 1")
          list.should have_content("Proverbs 1")

        page.find("#0_box").click #click the first checkbox

        visit "#{test_user_base_url}#{url}?day=1"
        box = page.find("#0_box")
        box.should be_checked

        box.click                 # to uncheck / unread
        visit "#{test_user_base_url}#{url}?day=1"
        box = page.find("#0_box")
        box.should_not be_checked
      end

      scenario "start and visit calendar" do
        start_subscription
        visit "#{test_user_base_url}#{url}?day=1"
        calendar_link = page.find("#sb-subscription a[title='Calendar']")
        calendar_link.should be_visible
        calendar_link.click

        page.find("h1").should have_content("Calendar")
        should_have_settings_sidebar
      end

      scenario "start and visit settings" do
        start_subscription
        visit "#{test_user_base_url}#{url}?day=1"
        settings_link = page.find("#sb-subscription a[title='Settings']")
        settings_link.should be_visible
        settings_link.click

        page.find("h1").should have_content("Settings")
        should_have_settings_sidebar
      end

    end

    describe "handling reference-less reading day" do

      scenario "should display message" do
        url = "/reading-plans/45-wisdom"

        visit url
          page.find("#subscription-start").click

        visit "#{test_user_base_url}#{url}?day=6" #no reading on this day.
          page.should have_content("No verses for today")

        visit "#{test_user_base_url}#{url}?day=7" #no reading on this day.
          page.should have_content("No verses for today")


        # quit subscription
        visit "#{test_user_base_url}#{url}/edit"
          page.find("#subscription-destroy").click
          page.find("#subscription-destroy").value.should have_content("Yes, I'm sure")
          page.find("#subscription-destroy").click

        visit url
          page.find("#subscription-start").should be_visible

      end
    end

    describe "visiting devotional" do
      scenario "viewing plan with devotional and reading" do
        url = "/reading-plans/356-lecrae-devotional"

      visit url
        page.find("#subscription-start").click

      # Sidebar should have devotional link
      visit "#{test_user_base_url}#{url}?day=1"
        page.find("#sidebar").should have_link("Devotional")

      # Page should have devotional content
      visit "#{test_user_base_url}#{url}/devotional?day=1"
        page.should have_content("Gravity - Lecrae") # Devotional heading

      # quit subscription
      visit "#{test_user_base_url}#{url}/edit"
        page.find("#subscription-destroy").click
        page.find("#subscription-destroy").value.should have_content("Yes, I'm sure")
        page.find("#subscription-destroy").click

      visit url
        page.find("#subscription-start").should be_visible
      end

    end

  end

end