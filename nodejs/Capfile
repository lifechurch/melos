# Load DSL and set up stages
require 'capistrano/setup'
require 'capistrano/deploy'
#require 'capistrano/passenger'
require 'capistrano/npm'
require 'capistrano/gulp'
require 'hipchat/capistrano'
require 'net/ssh/proxy/command'

bastion_host = 'shib.thewardro.be'
ssh_command = "ssh #{bastion_host} -W %h:%p"
set :ssh_options, proxy: Net::SSH::Proxy::Command.new(ssh_command)

# Load custom tasks from `lib/capistrano/tasks` if you have any defined
#Dir.glob('lib/capistrano/tasks/*.rake').each { |r| import r }
