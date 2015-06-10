# Load DSL and set up stages
require 'capistrano/setup'
require 'capistrano/deploy'
require "capistrano/bundler"
require "capistrano/rails/assets"
require "capistrano/rails/migrations"
require "capistrano/rvm"
require "capistrano/passenger"

set :default_env, {
  'FOG_DIRECTORY' => 'web-production',
  'FOG_PROVIDER' => 'AWS',
  'AWS_ACCESS_KEY_ID' => 'AKIAJTVJ5UNUPLF7N43Q',
  'AWS_SECRET_ACCESS_KEY' => '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',
  'SECURE_TRAFFIC' => true
}

set :passenger_restart_with_touch, true

# Load custom tasks from `lib/capistrano/tasks` if you have any defined
Dir.glob('lib/capistrano/tasks/*.rake').each { |r| import r }
