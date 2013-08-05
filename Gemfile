source "https://rubygems.org"

ruby '1.9.3'
gem 'rails', '3.2.13'

gem 'asset_sync',             '~> 0.5.3'
gem 'awesome_print',          '~> 1.0.2'
gem 'authorize-net',          '~> 1.5.2'
gem 'cells',                  '~> 3.8.3'
gem 'countries',              '~> 0.8.2'
gem 'dalli',                  '~> 2.6.3'
gem 'descriptive_statistics', '~> 1.1.0', require: false
gem 'geokit',                 '~> 1.6.5'
gem 'grackle',                '~> 0.3.0'
gem 'haml-rails',             '~> 0.3.4'
gem 'hashie',                 '~> 1.2.0'
gem 'oj'
gem "sentry-raven", :git => "https://github.com/getsentry/raven-ruby.git"

#gem 'oink'
gem 'gabba'
gem 'memcachier'

# Locked to 0.8.2 due to Marshall.dump bug in 0.8.3 (affecting memcache)
gem 'httparty',               '0.8.2'

gem 'http_accept_language',   '~> 1.0.2'
gem 'koala',                  '~> 1.6.0'
gem "language_list",          '~> 0.0.3'
gem 'newrelic_rpm',           '~> 3.5.7.59'
gem 'nokogiri',               '~> 1.5.2'
gem 'omniauth-facebook',      '~> 1.4.1'
gem 'omniauth-google-oauth2', '~> 0.1.9'
gem 'omniauth-twitter',       '~> 0.0.16'
gem 'rabl',                   '~> 0.7.3'
gem 'rack-mobile-detect',     '~> 0.3.0'
gem 'rack-rewrite',           '~> 1.3.3'
gem 'rack-timeout',           '~> 0.0.3'
gem 'viximo-rack-throttle',   '~> 0.5.0'

# Using locale files directly in /config/locales/rails-i18n until gem supports
# aliasing (or we come up with a way to resolve differences between gem lang
# codes and our tr8n codes, and api codes):
# github.com/svenfuchs/rails-i18n/tree/master/rails/locale/
# gem 'rails-i18n',           '~> 0.6.3'

gem 'routing-filter',         '~> 0.3.1'
gem "unicorn",               '~> 4.3.1'

# Gems used only for assets & not required in production environments by default
group :assets do
  gem 'sass-rails',       '3.2.5'
  gem 'coffee-rails',  '~> 3.2.2'
  gem 'compass-rails', '~> 1.0.3'
  gem 'uglifier',      '~> 1.3.0'
  gem 'css_parser',    '~> 1.2.6'
  gem 'jquery-rails',  '~> 2.1.4'
end

group :test, :development do
  gem 'debugger'
  gem 'capybara',       '~> 1.1.2'
  gem 'capybara-mechanize', '~> 0.3.0'
  gem "capybara-webkit", "~> 0.12.1"
  gem "capybara-screenshot", "~> 0.3.4"
  gem 'cucumber-rails', '~> 1.3.0', require: false
  gem 'rspec-cells'
  gem 'rspec-rails'
  gem 'minitest'
  gem 'tddium',         '~> 1.4.6'
  gem 'simplecov', require: false
end

group :development, :tddium_ignore do
  gem 'powder'
  gem 'guard'
  gem 'guard-cucumber'
  gem 'guard-bundler'
  gem 'guard-rspec'
  gem 'hooves'
  gem 'pry', require: false
  gem 'quiet_assets'
  gem 'spork-rails'
end

#gem 'rack-mini-profiler'
