Given /^the following bookmarks exist:$/ do |table|
  # table is a Cucumber::Ast::Table
  # | Username | Reference      | Title         | Labels        |
  # | cukeuser_bookmark1 | gen.1.1.niv    | The Beginning | old,labeltext |
  # | cukeuser_bookmark1 | matt.1.1-5.asv | New Testament | new,gospel    |
  table.hashes.each do |row|
    puts "Row keys are #{row.keys}"
    pp row
    puts "*"*80
  end
  puts "Also, @user is #{pp @user.inspect}"
  pending # express the regexp above with the code you wish you had
end