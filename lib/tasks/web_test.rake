# web_test tasks
# To guarantee clean, uninterrupted access to the database and API on web-test.yvdev.com,
# run `rake web_test:lock`. To reset the API DB to a clean state, run `rake web_test:reset`.
# To release access, run `rake web_test:unlock`. To lock and reset, run `rake web_test:start`.

namespace :web_test do
  task :default => "start"
  task :lock do
    response = HTTParty.get("http://web-test.yvdev.com:4567/lock/#{ENV['USER']}")
    puts "** LOCK:   #{response.body}"
    raise response.body if response.code >= 400
  end

  task :reset do
    response = HTTParty.get("http://web-test.yvdev.com:4567/reset/#{ENV['USER']}")
    puts "** RESET:  #{response.body}"
    raise response.body if response.code >= 400
  end

  task :unlock do
    response = HTTParty.get("http://web-test.yvdev.com:4567/unlock/#{ENV['USER']}")
    puts "** UNLOCK: #{response.body}"
    raise response.body if response.code >= 400
  end

  task :start do
    Rake::Task["web_test:lock"].invoke
    Rake::Task["web_test:reset"].invoke
  end

  task :stop do
    Rake::Task["web_test:unlock"].invoke
  end
end
