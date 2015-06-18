# Load DSL and set up stages
require "capistrano/setup"
require "capistrano/deploy"
require "capistrano/bundler"
require "capistrano/rails/assets"
require "capistrano/rvm"
require "capistrano/passenger"
require 'hipchat/capistrano'
require "capistrano/datadog"

# Load custom tasks from `lib/capistrano/tasks` if you have any defined
Dir.glob('lib/capistrano/tasks/*.rake').each { |r| import r }
