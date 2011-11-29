Given /^the following bookmarks exist:$/ do |table|
  # table is a Cucumber::Ast::Table
  # | Username | Reference      | Title         | Labels        |
  # | cukeuser_bookmark1 | gen.1.1.niv    | The Beginning | old,labeltext |
  # | cukeuser_bookmark1 | matt.1.1-5.asv | New Testament | new,gospel    |
  table.hashes.each do |row|
    puts "Row keys are #{row.keys}"
    pp row
    puts "*"*80
    puts row['Reference'].to_osis_hash.except(:version).to_osis_string
    bk = Bookmark.new(reference: row['Reference'].to_osis_hash.except(:version).to_osis_string, version: row["Reference"].to_osis_hash[:version], title: row["Title"], labels: row["Labels"], auth: Hashie::Mash.new(username: row["Username"], password: "tenders"))
    result = bk.save
    puts bk.errors.full_messages
    result.should_not be_false
  end
  puts "Also, @user is #{pp @user.inspect}"

end
