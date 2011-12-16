source 'http://rubygems.org'

gem 'rails', '3.1.2'
gem 'httparty'
gem 'memcache-client'
gem 'hashie'
gem 'cells'
gem 'haml-rails', "  ~> 0.3.4"
gem 'jquery-rails'
gem 'routing-filter'
gem 'execjs'
gem 'therubyracer'
gem 'unicorn'
gem 'newrelic_rpm'
gem 'exceptional'
gem 'countries'

# Gems used only for assets and not required
# in production environments by default.
group :assets do
  gem 'sass-rails', "  ~> 3.1.0"
  gem 'coffee-rails', "~> 3.1.0"
  gem 'uglifier'
  gem 'compass', '~> 0.11.1'
  gem 'css_parser', '~> 1.1.9'
end


# Use unicorn as the web server
# gem 'unicorn'

# Deploy with Capistrano
# gem 'capistrano'

group :test, :development do
  # Pretty printed test output
  gem 'turn', '< 0.8.3', :require => false
  gem 'cucumber-rails', "~> 0.5.0.beta1"
  gem 'rspec-cells'
  gem 'capybara', "~> 1.0.0.beta1"
  gem 'rspec-rails'
  gem 'heroku_san'
  gem 'capistrano'
  gem 'capistrano-ext'
  # To use, start rails with --debug option ($ rails s --debug)
  gem 'ruby-debug19'
end

group :test do
end

group :development do
  gem 'pry'
  # gem 'rb-fsevent', :require => false if RUBY_PLATFORM =~ /darwin/i
  gem 'spork'
  gem 'guard'
  gem 'guard-rspec'
  gem 'guard-cucumber'
  gem 'guard-bundler'
  gem 'guard-spork'
  gem 'ruby-debug19', :require => 'ruby-debug'
end
