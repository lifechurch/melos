# This goes in lib/tasks/memcached.rake
require 'socket'

namespace :memcached do
  desc "Flush memcached (running on localhost port 11211)"
  task :flush do
    socket = TCPSocket.new('127.0.0.1', 11211)
    socket.write("flush_all\r\n")
    result = socket.recv(200)
    if result.strip == 'OK'
      puts "memcached flush successfully, clearing statistics"
      socket.write("stats reset\r\n")
      result = socket.recv(200)
      if result.strip == 'RESET'
        puts "memcached statistics cleared"
      end
    else
      STDERR.puts "Error flushing memcached: #{result}"
    end
    socket.close
  end
end
