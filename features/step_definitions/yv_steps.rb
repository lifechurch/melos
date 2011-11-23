Given /^a user named "([^"]*)" with password "([^"]*)" does not exist$/ do |arg1, arg2|
  User.authenticate(arg1, arg2).should_not be_true
end

Given /^these users:$/ do |table|
  @rows = table.hashes
  @rows.each do |r|
    user = User.authenticate(r['username'], r['password'])
    unless user.class == User
      User.new({username: r['username'], password: r['password'], email: r['email address'], verified: true, agree: true }).create
      user = User.authenticate(r['username'], r['password'])
    end
    user.should be_a User
  end
end

Given /^I am signed in as "([^"]*)" with password "([^"]*)"$/ do |u, p|
  step %{I go to the sign in page}
  step %{I fill in "username" with "#{u}"}
  step %{I fill in "password" with "#{p}"}
  step %{I press "Sign in"}
end

Given /^I have beta access as "([^"]*)", "([^"]*)"$/ do |u, p|
  step %{the beta is open}
  step %{I go to the beta signup page}
  step %{I fill in "username" with "#{u}"}
  step %{I fill in "password" with "#{p}"}
  step %{I press "Try the Beta"}
end

Given /^(.*) is not signed up for the beta$/ do |u|
  BetaRegistration.where(username: u).should be_empty
end

Given /^(.*) is signed up for the beta$/ do |u|
  if BetaRegistration.where(username: u).empty?
    BetaRegistration.create(username: u)
  end
end

Given /^the beta is closed$/ do
  `echo "closed" > #{Rails.root.join("beta.txt")}`

end

Given /^the beta is open$/ do
  `echo "open" > #{Rails.root.join("beta.txt")}`

end

Given /^a user named "([^"]*)" with password "([^"]*)" and email "([^"]*)" exists$/ do |username, password, email| # "
  @user = User.new({username: username, password: password, email: email, verified: true, agree: true }).create
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
