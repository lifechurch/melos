# Load DSL and set up stages
require 'capistrano/setup'
require 'capistrano/deploy'
require 'capistrano/bundler'
require 'capistrano/rails/assets'
require 'capistrano/rvm'
require 'capistrano/passenger'
require 'hipchat/capistrano'
require 'capistrano/datadog'
set :datadog_api_key, 'f0bc018e3f69961214ea44382eb0ad52'

# Load custom tasks from `lib/capistrano/tasks` if you have any defined
Dir.glob('lib/capistrano/tasks/*.rake').each { |r| import r }
