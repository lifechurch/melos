source 'http://rubygems.org'

gem 'rails', '~> 3.1.0'
gem 'httparty'
gem 'memcache-client'
gem 'hashie'
gem 'cells'
gem 'haml-rails', "  ~> 0.3.4"
gem 'jquery-rails'
gem 'pg'
gem 'routing-filter'

# Gems used only for assets and not required
# in production environments by default.
group :assets do
  gem 'sass-rails', "  ~> 3.1.0"
  gem 'coffee-rails', "~> 3.1.0"
  gem 'uglifier'
end


# Use unicorn as the web server
# gem 'unicorn'

# Deploy with Capistrano
# gem 'capistrano'

# To use debugger
# gem 'ruby-debug19', :require => 'ruby-debug'

group :test, :development do
  # Pretty printed test output
  gem 'turn', :require => false
  gem "rspec-rails", ">= 2.6.0"
  gem 'cucumber-rails', "~> 0.5.0.beta1"
  gem 'rspec-cells'
  gem 'capybara', "~> 1.0.0.beta1"
  # gem 'rb-fsevent', :require => false if RUBY_PLATFORM =~ /darwin/i
  gem 'guard'
  gem 'guard-rspec'
  gem 'guard-cucumber'
  gem 'guard-bundler'
  gem 'heroku_san'
end

group :test do
  gem 'vcr'
  gem 'webmock'
end

group :development do
  gem 'pry'
end
