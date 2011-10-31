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

Given /^notes exist with the following attributes:$/ do |table|
  
  @rowsfound = []
  @rows = table.hashes
  
  @rows.each do |row|
    @user = User.authenticate(row['Author'], 'tenders');
    @auth = Hashie::Mash.new( {'id' => @user.id, 'username' => @user.username, 'password' => 'tenders' } )
    @notes = Note.for_user(@user.id, @auth)
    
    if @notes  
      @notes.each do |note|
        if note.title == row['Title'] && note.username == row['Author'] && note.content == row['Content'] && note.reference.osis == row['References'] && note.user_status.upcase == row['Status'].upcase
          @rowsfound << true
          #TEST: puts "Found #{note.username} #{note.title} -> #{note.user_status}"
        end
      end
    end
  end

  #TEST: puts "Rows = #{@rows.count} -> Found = #{@rowsfound.count}"
  if @rowsfound.count >= @rows.count
    assert true
  else
    assert false, 'Not all rows found'
  end  
  
end

When /^I select "([^"]*)" from the dropdown "([^"]*)"$/ do |arg1, arg2|
  select(arg1, :from => arg2)
end

When /^I click "([^"]*)"$/ do |arg1|
  click_button arg1
end
