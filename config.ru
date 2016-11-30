# This file is used by Rack-based servers to start the application.

if (ENV['RAILS_ENV'] == 'development')
  require 'rubygems'
  require 'bundler'
  Bundler.setup
end

require ::File.expand_path('../config/environment',  __FILE__)
require File.join(File.dirname(__FILE__), 'lib/health.rb')

use Rack::Deflater
run YouversionWeb::Application
