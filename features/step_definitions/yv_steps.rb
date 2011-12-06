
Given /^a user named "([^"]*)" exists$/ do |arg1|
  unless user = User.authenticate(arg1, "tenders")
    opts = {email: "#{arg1}@youversion.com", password: "tenders", agree: true, verified: true, username: arg1}
    new_user = User.new(opts)
    response = new_user.register
    puts new_user.errors
    response.should be_true
    user = User.authenticate(arg1, "tenders")
  end
  user.should be_a User
end

Given /^a user named "([^"]*)" with password "([^"]*)" exists$/ do |arg1, arg2|  
  User.authenticate(arg1, arg2).should_not == nil
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
    note = Note.new(title: row['Title'], content: row['Content'], reference: row['References'], version: row['Version'], user_status: row['Status'].downcase, auth: auth)
    result = note.save
    puts note.errors.full_messages
    result.should_not be_false
  end
#     if @notes  
#       @notes.each do |note|
#         if note.title == row['Title'] && note.username == row['Author'] && note.content == row['Content'] && note.reference.osis == row['References'] && note.user_status.upcase == row['Status'].upcase
#           @rowsfound << true
#         end
#       end
#     end
#   end
# 
#   if @rowsfound.count >= @rows.count
#     assert true
#   else
#     assert false, 'Not all rows found'
#   end  
  
end

Given /^a user named "([^"]*)" with password "([^"]*)" does not exist$/ do |arg1, arg2|
  User.authenticate(arg1, arg2).should_not be_true
end

Given /^these users exist:$/ do |table|
  @rows = table.hashes
  @rows.each do |r|
    user = User.authenticate(r['username'], r['password'])
    unless user.class == User
      User.new({username: r['username'], password: r['password'], email: r['email address'], verified: true, agree: true }).register
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

