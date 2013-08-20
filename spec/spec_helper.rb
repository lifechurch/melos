require 'rubygems'

ENV["RAILS_ENV"] = 'test'

# Zeus Prefork/Each Run code
# Reference: https://github.com/burke/zeus/wiki/Spork

prefork = lambda {
  require 'rspec/rails'
  require 'capybara/rspec'
  require 'capybara-screenshot/rspec'
  require 'simplecov'
  SimpleCov.start 'rails'
  require File.expand_path("../../config/environment", __FILE__)
  Dir[Rails.root.join("spec/support/**/*.rb")].each {|f| require f}

  RSpec.configure do |c|
    c.filter_run :only => true
    c.treat_symbols_as_metadata_keys_with_true_values = true
    c.filter_run focus: true
    c.run_all_when_everything_filtered = true
    c.mock_with :rspec
    c.filter_run_excluding :slow unless ENV["SLOW_SPECS"]
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

}

each_run = lambda {
  include ApplicationHelper
  include UsersSpecHelper
  include ConnectionsSpecHelper
  include IntegrationHelpers
  # reload all the models
  Dir["#{Rails.root}/app/models/**/*.rb"].each do |model|
    load model
  end
}

# Zeus Prefork/Each Run code
# Reference: https://github.com/burke/zeus/wiki/Spork
if defined?(Zeus)
  prefork.call
  $each_run = each_run
  class << Zeus.plan
    def after_fork_with_test
      after_fork_without_test
      $each_run.call
    end
    alias_method_chain :after_fork, :test
  end
else
  prefork.call
  each_run.call
end
