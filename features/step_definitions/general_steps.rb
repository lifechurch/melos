Given /^a user named "([^"]*)" exists$/ do |arg1|
  User.authenticate(arg1, "tenders").should_not == nil
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
    references = row['References'].split(",").map { |r| Reference.new(r).notes_api_string }.join("+")
    note = Note.new(title: row['Title'], content: row['Content'], reference: references, version: row['Version'], user_status: row['Status'].downcase, auth: auth)
    result = note.save
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

When /^I select "([^"]*)" from the dropdown "([^"]*)"$/ do |arg1, arg2|
  select(arg1, :from => arg2)
end

When /^I click "([^"]*)"$/ do |arg1|
  click_button arg1
end
