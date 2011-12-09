
Given /^"([^"]*)" has ([0-9]*) notes with the title "([^"]*)"$/ do |username, number, title|
  number = number.to_i
  (1..number).each do |n|
    puts "creating ##{n}..."
    nt = Note.new(reference: "gen.1.1.asv", title: "##{n} #{title}", content: "test content", auth: Hashie::Mash.new(username: username,  password: "tenders"))
    result = nt.save
    # puts bk.errors.full_messages
    result.should_not be_false
  end
end
