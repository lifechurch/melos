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
  
  true # TODO: Complete

  #@auth = Hashie::Mash.new( {'id' => '4163177', 'username' => 'testuser', 'password' => 'tenders' } )
  #@row = table.hashes.first
  #@notes = Note.find_by_search(@row['Title'], @auth)
  
  #if @notes.errors.count == 0
  #  @notes.each do |note|
  #    if note.title == @row['title'] && note.author == @row['author'] && note.Content == @row['content'] && note.References == @row['references'] && note.Status = @row['status']
  #      true
  #    end
  #  end
  #else
  #  puts 'Cannot find Note!'
  #  false
  #end
  
  #false
end

When /^I select "([^"]*)" from the dropdown "([^"]*)"$/ do |arg1, arg2|
  select(arg1, :from => arg2)
end

When /^I click "([^"]*)"$/ do |arg1|
  click_button arg1
end
