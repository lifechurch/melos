# IMPORTANT: This file is generated by cucumber-rails - edit at your own peril.
# It is recommended to regenerate this file in the future when you upgrade to a
# newer version of cucumber-rails. Consider adding your own code to a new file
# instead of editing this one. Cucumber will automatically load all features/**/*.rb
# files.

require 'capybara'

prefork = lambda {

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

  unless ENV['DRB'] || ENV['TDDIUM']
    # TDDium doesn't support simplecov
    # this configuration is required to get simplecov
    # to execute correctly with DRB servers like Spork
    require 'simplecov'
    SimpleCov.start 'rails'
  end

  require 'cucumber/rails'

  # Capybara defaults to XPath selectors rather than Webrat's default of CSS3.
  # If you'd prefer to use XPath just remove this line
  # and adjust selectors in your steps to use the XPath syntax.
  Capybara.default_selector = :css

  # We use capybara-webkit for better/faster browser emulation
  # Comment out to use the default of selenium
  Capybara.javascript_driver = :webkit

  # By default, any exception happening in your Rails application will bubble up
  # to Cucumber so that your scenario will fail. This is a different from how
  # your application behaves in the production environment, where an error page will
  # be rendered instead.
  #
  # Sometimes we want to override this default behaviour and allow Rails to rescue
  # exceptions and display an error page (just like when the app is running in production).
  # Typical scenarios where you want to do this is when you test your error pages.
  # There are two ways to allow Rails to rescue exceptions:
  #
  # 1) Tag your scenario (or feature) with @allow-rescue
  #
  # 2) Set the value below to true. Beware that doing this globally is not
  # recommended as it will mask a lot of errors for you!
  ActionController::Base.allow_rescue = false

  # Remove/comment out the lines below if your app doesn't have a database.
  # For some databases (like MongoDB and CouchDB) you may need to use :truncation instead.
  # begin
  #   DatabaseCleaner.strategy = :transaction
  # rescue NameError
  #   raise "You need to add database_cleaner to your Gemfile (in the :test group) if you wish to use it."
  # end

  # You may also want to configure DatabaseCleaner to use different strategies for certain features and scenarios.
  # See the DatabaseCleaner documentation for details. Example:
  #
  #   Before('@no-txn,@selenium,@culerity,@celerity,@javascript') do
  #     DatabaseCleaner.strategy = :truncation, {:except => %w[widgets]}
  #   end
  #
  #   Before('~@no-txn', '~@selenium', '~@culerity', '~@celerity', '~@javascript') do
  #     DatabaseCleaner.strategy = :transaction
  #   end
  #

}

each_run = lambda {
  if !ENV['TDDIUM']
    # TDDium doesn't support simplecov
    require 'simplecov'
    SimpleCov.start 'rails'
  end
}

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