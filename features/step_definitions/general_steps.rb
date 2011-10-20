Given /^a user named "([^"]*)" with password "([^"]*)" exists$/ do |arg1, arg2|  
  User.authenticate(arg1, arg2).should_not == nil
end

Given /^I am logged in as "([^"]*)" with password "([^"]*)"$/ do |arg1, arg2|
  visit '/sign-in'
  fill_in "username", :with => arg1
  fill_in "password", :with => arg2
  click_button "Sign in"
  assert page.has_content?('Signed in!')
end

When /^I select "([^"]*)" from the dropdown "([^"]*)"$/ do |arg1, arg2|
  select(arg1, :from => arg2)
end

When /^I click "([^"]*)"$/ do |arg1|
  click_button "Save"
end
