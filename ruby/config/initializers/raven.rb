require 'raven'

Raven.configure do |config|
  # See ruby/config/_config.yml
  config.dsn = Cfg.sentry_dsn
end
