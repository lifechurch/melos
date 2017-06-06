Given /^I am logged in with "([^"]*)"$/ do |arg1|
  visit '/sign-in'
  fill_in "username", :with => arg1
  fill_in "password", :with => "tenders"
  click_button "Sign in"
  assert page.has_content?('testuser')    
end

When /^I click the notes icon in the main nav$/ do
  pending # express the regexp above with the code you wish you had
end