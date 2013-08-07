require 'spec_helper'

describe "Reading Plans" do

  let(:available_locales) {[:af,:ca,:cs,:cy,:de,:en,:es,:fi,:fr,:id,:it,:ja,:ko,:mn,:ms,:nl,:no,:pl,:pt,:ro,:ru,:sk,:sq,:sv,:tl,:tr,:uk,:vi,:"zh-CN",:"zh-TW"]}

  it "should show me a list of reading plans in all locales" do
    available_locales.each do |locale|
      visit "/#{locale.to_s}/reading-plans"
      page.should have_css("#plan-index")
    end
  end

  it "should show me an individual reading plan" do
    visit "/reading-plans/45-wisdom"
    page.should have_content("Wisdom")
    page.should have_content("More Info")
    page.should have_content("View a Sample Reading")
    page.should have_content("Publisher")
  end

  it "should let me read samples of the reading plan" do
    visit "/reading-plans/45-wisdom"
    click_link("View a Sample Reading")

    page.should have_content("Start This Plan")
    page.should have_content("Day 1 of 12")
    page.should have_content("Next Day")
    page.should have_content("And Solomon made affinity with Pharaoh king of Egypt") #reader content

    click_link("Next Day")
    page.should have_content("Start This Plan")
    page.should have_content("Day 2 of 12")
  end


end