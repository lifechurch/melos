Given /^a user named "([^"]*)" with password "([^"]*)" does not exist$/ do |arg1, arg2|
  User.authenticate(arg1, arg2).should_not be_true
end

Given /^a user named "([^"]*)" with password "([^"]*)" and email "([^"]*)" exists$/ do |username, password, email| # "
  User.new({username: username, password: password, email: email, verified: true, agree: true }).create
end

Given /^I am signed out$/ do
  visit sign_out_path
end

Then /^I should see a (.*) with contents (.*)$/ do |select, options| # "
  options.split(", ").each do |opt|
    el.should have_content(opt.gsub(/(^\")|(\"$)/, ""))
  end
end

Then /^"([^"]*)" should be selected for "([^"]*)"$/ do |value, field|
  page.should have_xpath("//option[@selected and @value = '#{value}']")
end

Then /^"(.*)" should be selected$/ do |value|
  with_scope("selected") { page.should have_content value }
end

Then /^an unverified user named "([^"]*)" with password "([^"]*)" should exist$/ do |arg1, arg2|
  lambda do
    YvApi.get("users/authenticate", auth_username: arg1, auth_password: arg2)
  end.should raise_error("API Error: This account has not been verified.")
end

When /^I dump.* the response$/ do
  puts body
end

When /^I dump the host$/ do
  puts host
end