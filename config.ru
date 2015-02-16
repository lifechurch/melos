require 'rubygems'
require 'bundler'
Bundler.setup

# This file is used by Rack-based servers to start the application.

max_request_min = Integer(ENV['UNICORN_MAX_WORKER_REQ'] || 500)
max_request_max = Integer(ENV['UNICORN_MAX_WORKER_REQ'] || 600)


if ENV['RAILS_ENV'] == 'development'
  require 'unicorn'
end

# Unicorn self-process killer
require 'unicorn/worker_killer'

# Max requests per worker
use Unicorn::WorkerKiller::MaxRequests, max_request_min, max_request_max, true

oom_min = Integer(ENV['UNICORN_MAX_WORKER_MEM'] || 200) * (1024**2)
oom_max = Integer(ENV['UNICORN_MAX_WORKER_MEM'] || 220) * (1024**2)

# Max memory size (RSS) per worker
use Unicorn::WorkerKiller::Oom, oom_min, oom_max, 16, true
# end

require ::File.expand_path('../config/environment',  __FILE__)
require File.join(File.dirname(__FILE__), 'lib/health.rb')

use Heroku::HttpHealth
use Rack::Deflater
run YouversionWeb::Application
