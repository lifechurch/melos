require 'rubygems'
require 'spork'

ENV["RAILS_ENV"] = 'test'

Spork.prefork do
  unless ENV['DRB']
    require 'simplecov'
    SimpleCov.start 'rails'
  end

  require File.expand_path("../../config/environment", __FILE__)
  require 'rspec/rails'
  require 'capybara/rspec'
  RSpec.configure do |config|
    config.mock_with :rspec
  end

end

Spork.each_run do
  if ENV['DRB']
    # this configuration is required to get simplecov
    # to execute correctly with a DRB servers like Spork
    require 'simplecov'
    SimpleCov.start 'rails'
  end

  Dir[Rails.root.join("spec/support/**/*.rb")].each {|f| require f}
  include UsersSpecHelper
  include ConnectionsSpecHelper
  # reload all the models
  Dir["#{Rails.root}/app/models/**/*.rb"].each do |model|
    load model
  end
end

RSpec.configure do |c|
  c.filter_run :only => true
  c.run_all_when_everything_filtered = true
end

module ::RSpec::Core
  class ExampleGroup
    include Capybara::DSL
    include Capybara::RSpecMatchers
  end
end
