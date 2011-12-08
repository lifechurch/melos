require 'rubygems'
require 'spork'

Spork.prefork do
  ENV["RAILS_ENV"] ||= 'test'
  require File.expand_path("../../config/environment", __FILE__)
  require 'rspec/rails'
  Dir[Rails.root.join("spec/support/**/*.rb")].each {|f| require f}
  include UsersSpecHelper
  RSpec.configure do |config|
    config.mock_with :rspec
  end
  
end

Spork.each_run do
  
end

