require 'rubygems'
require 'spork'

ENV["RAILS_ENV"] = 'test'
Spork.prefork do
  require File.expand_path("../../config/environment", __FILE__)
  require 'rspec/rails'
  RSpec.configure do |config|
    config.mock_with :rspec
  end
  
end
Spork.each_run do
  Dir[Rails.root.join("spec/support/**/*.rb")].each {|f| require f}
  include UsersSpecHelper
  # reload all the models
  Dir["#{Rails.root}/app/models/**/*.rb"].each do |model|
    load model
  end
end

