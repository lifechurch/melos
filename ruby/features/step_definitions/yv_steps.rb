# * http://benmabey.com/2008/05/19/imperative-vs-declarative-scenarios-in-user-stories.html
# * http://dannorth.net/2011/01/31/whose-domain-is-it-anyway/
# * http://elabs.se/blog/15-you-re-cuking-it-wrong

Dir[
  File.expand_path(
    Rails.root.join 'spec/support', '**', '*.rb'
  )
].each {|f| require f}

Given /^a user named "([^"]*)" exists$/ do |arg1|
  ensure_user(username: arg1)
end

Given /^a user named "([^"]*)" with password "([^"]*)" exists$/ do |arg1, arg2|
  ensure_user(username: arg1, password: arg2)
end

Then /^a user named named "([^"]*)" with password "([^"]*)" should exist$/ do |u, p|
  User.authenticate(u, p).should be_true
end

Given /^I am logged in as "([^"]*)"$/ do |arg1|
  visit '/sign-in'
  fill_in "username", :with => arg1
  fill_in "password", :with => "tenders"
  click_button "Sign in"
  assert page.has_content?('Signed in!')
end

Given /^I am logged in as "([^"]*)" with password "([^"]*)"$/ do |arg1, arg2|
  visit '/sign-in'
  fill_in "username", :with => arg1
  fill_in "password", :with => arg2
  click_button "Sign in"
  assert page.has_content?('Signed in!')
end

Given /^these notes exist:$/ do |table|
  @rows = table.hashes
  @rows.each do |row|
    @user = User.authenticate(row['Author'], 'tenders');
    auth = Hashie::Mash.new( {'user_id' => @user.id, 'username' => @user.username, 'password' => 'tenders' } )
    note = Note.new(title: row['Title'], content: row['Content'], reference_list: row['References'], version: row['Version'], user_status: row['Status'].downcase, auth: auth)
    result = note.save
    result.should_not be_false
  end
end

Given /^a user named "([^"]*)" with password "([^"]*)" does not exist$/ do |arg1, arg2|
  User.authenticate(arg1, arg2).should_not be_true
end

Given /^these users exist:$/ do |table|
  @rows = table.hashes
  @rows.each do |r|
    user = User.authenticate(r['username'], "tenders")
    unless user.class == User
      resp = User.register({username: r['Username'], password: "tenders", email: "#{r['Username']}@youversion.com", verified: true, agree: true })
      resp.should_not be_false

      user = User.authenticate(r['Username'], "tenders")
      unless user
        # ugh
        sleep 3
        user = User.authenticate(r['Username'], "tenders")
      end
    end
    user.should be_a User
    if r.has_key?('First Name') && r.has_key?('Last Name') && r.has_key?('Location') && r.has_key?('Web Site')
      result = user.update({first_name: r['First Name'], last_name: r['Last Name'], website: r['Web Site'], location: r['Location']})
      result.should be_true
    end
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

Given /^I have beta access as "([^"]*)"$/ do |u|
  step %{the beta is open}
  step %{I go to the beta signup page}
  step %{I fill in "username" with "#{u}"}
  step %{I fill in "password" with "tenders"}
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
