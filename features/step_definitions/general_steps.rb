
When /^I select "([^"]*)" from the dropdown "([^"]*)"$/ do |arg1, arg2|
  select(arg1, :from => arg2)
end

When /^I click "([^"]*)"$/ do |arg1|
  click_button arg1
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

Then /^"([^"]*)" should not be visible$/ do |text|
  page.should have_no_css('*', :text => text, :visible => true)
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

When /^I dump the path$/ do
  puts URI.parse(current_url).path
end
