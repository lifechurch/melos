source :rubygems

gem 'rails', '3.1.2'

gem 'asset_sync',             '~> 0.2.12' # 0.4.1
gem 'awesome_print',          '~> 1.0.2'
gem 'authorize-net',          '~> 1.5.2'
gem 'cells',                  '~> 3.8.3'
gem 'countries',              '~> 0.8.2'
gem 'dalli',                  '~> 2.0.4'
gem 'exceptional',            '~> 2.0.32'
gem 'geokit',                 '~> 1.6.5'
gem 'grackle',                '~> 0.1.10'
gem 'haml-rails',             '~> 0.3.4'
gem 'hashie',                 '~> 1.2.0'
gem 'heroku',                 '~> 2.25'
gem 'httparty',               '~> 0.8.3'
gem 'http_accept_language',   '~> 1.0.2'
gem 'koala',                  '~> 1.3.0' # 1.4.1
gem 'newrelic_rpm',           '~> 3.3.4'
gem 'omniauth-facebook',      '~> 1.2.0' # 1.3.0
gem 'omniauth-google-oauth2', '~> 0.1.9'
gem 'omniauth-twitter',       '~> 0.0.11'
gem 'rack-mobile-detect',     '~> 0.3.0'
gem 'rack-rewrite',           '~> 1.2.1'
gem 'rack-timeout',           '~> 0.0.3'
# Using locale files directly in /config/locales/rails-i18n until gem supports
# aliasing (or we come up with a way to resolve differences between gem lang
# codes and our tr8n codes, and api codes)
# gem 'rails-i18n',            '~> 0.6.3'
gem 'routing-filter',         '~> 0.3.1'
gem 'unicorn',                '~> 4.1.1' #4.3.1

# Gems used only for assets & not required in production environments by default
group :assets do
  # There is a bug in 3.1.6 so this is locked until we upgrade to Rails 3.2
  gem 'sass-rails',       '3.1.5' #3.2.5
  gem 'coffee-rails',  '~> 3.1.0' #3.2.2
  gem 'uglifier',      '~> 1.2.4'

  gem 'compass',       '0.12.rc.1'
  gem 'compass-rails', '1.0.0.rc.3'
  gem 'css_parser',    '~> 1.1.9'
  gem 'jquery-rails',  '~> 1.0.19' #2.0.1 is Rails 3.2+ only
end

group :test, :development do
  gem 'capybara',       '~> 1.0.0.beta1'
  gem 'cucumber-rails', '~> 0.5.0.beta1', require: false
  gem 'debugger'
  gem 'heroku_san'
  gem 'rspec-cells'
  gem 'rspec-rails'
  gem 'turn'
  gem 'minitest'
end

group :development do
  # gem 'rb-fsevent', require: false if RUBY_PLATFORM =~ /darwin/i
  gem 'active_reload'
  gem 'guard'
  gem 'guard-cucumber'
  gem 'guard-bundler'
  # TODO: Add guard-livereload
  gem 'guard-rspec'
  gem 'guard-spork'
  gem 'pry'
  gem 'ruby-prof'
  gem 'spork'
  gem 'thin'
end
