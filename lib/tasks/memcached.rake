# This goes in lib/tasks/memcached.rake
require 'socket'

namespace :memcached do
  desc "Flush memcached (running on localhost port 11211)"
  task :flush do
    socket = TCPSocket.new('127.0.0.1', 11211)
    socket.write("flush_all\r\nstats reset\r\n")
    result = socket.recv()
    if result == 'OK'
      puts "memcached flush."
    else
      STDERR.puts "Error flushing memcached: #{result}"
    end
    socket.close
  end
end
