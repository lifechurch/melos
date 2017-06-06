avg = 0
1.upto(10) do |i|
  puts "Run number #{i}"
  puts "Getting page 1 of Bookmarks"
  time = Benchmark.realtime do 
    Bookmark.all(page: 1, user_id: 7830, auth: {username: 'matt', password: 'staging'}, cache_for: 0)
  end
  avg += time
  puts "#{time*1000} run time (ms)"
end
  puts "#{avg/10*1000} average time (ms)"
