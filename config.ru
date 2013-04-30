# This file is used by Rack-based servers to start the application.

require ::File.expand_path('../config/environment',  __FILE__)
require File.join(File.dirname(__FILE__), 'lib/health.rb')
require 'unicorn/worker_killer'
require 'unicorn/oob_gc'

oom_min = ((ENV['OOM_MIN'].to_i || 150) * (1024**2))
oom_max = ((ENV['OOM_MAX'].to_i || 175) * (1024**2))

use Unicorn::WorkerKiller::Oom, oom_min, oom_max
use Unicorn::OobGC

use Heroku::HttpHealth
use Rack::Deflater
run YouversionWeb::Application
