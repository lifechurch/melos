require 'rubygems'
require 'spork'

ENV["RAILS_ENV"] = 'test'

Spork.prefork do
  unless ENV['DRB']
    # this configuration is required to get simplecov
    # to execute correctly with DRB servers like Spork
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
	include ApplicationHelper
  if ENV['DRB']
    # this configuration is required to get simplecov
    # to execute correctly with DRB servers like Spork
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

# Capybara.server do |app, port|
#   require 'hooves/unicorn'
#   Rack::Handler::Hooves::Unicorn.run(app, :Port => port, worker_processes: 1)
# end

# working around TDDium issue with capybara-webkit
# where using Thin causes invalid responses and EPIPE errors
# https://github.com/thoughtbot/capybara-webkit/issues/331
Capybara.server do |app, port|
  require 'rack/handler/webrick'
  Rack::Handler::WEBrick.run(app, :Port => port, :AccessLog => [], :Logger => WEBrick::Log::new(nil, 0))
end

Capybara.javascript_driver = :webkit
Capybara.default_wait_time = 5


module ::RSpec::Core
  class ExampleGroup
    include Capybara::DSL
    include Capybara::RSpecMatchers
  end
end
