Rack::Timeout.timeout = Cfg.rack_execution_timeout.to_f
Rack::Timeout::Logger.disable
