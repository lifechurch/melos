# This file is used by Rack-based servers to start the application.

require ::File.expand_path('../config/environment',  __FILE__)
require File.join(File.dirname(__FILE__), 'lib/health.rb')

use Heroku::HttpHealth
use Rack::Deflater
run YouversionWeb::Application
