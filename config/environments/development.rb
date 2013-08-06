YouversionWeb::Application.configure do
  # Settings specified here will take precedence over those in config/application.rb

  # In the development environment your application's code is reloaded on
  # every request.  This slows down response time but is perfect for development
  # since you don't have to restart the web server when you make code changes.
  config.cache_classes = false

  # Log error messages when you accidentally call methods on nil.
  config.whiny_nils = true

  # Show full error reports and disable caching
  config.consider_all_requests_local       = true
  config.action_controller.perform_caching = false

  # Don't care if the mailer can't send
  config.action_mailer.raise_delivery_errors = false

  # Print deprecation notices to the Rails logger
  config.active_support.deprecation = :log

  # Only use best-standards-support built into browsers
  config.action_dispatch.best_standards_support = :builtin

  # Do not compress assets
  config.assets.compress = false

  # Expands the lines which load the assets
  config.assets.debug = true

  # Fallback to assets pipeline since we don't require
  # precompilation of assets in development
  config.assets.compile = true

  # Turn off quiet assets (defaults to true)
  # config.quiet_assets = false

  # memcache for action and fragment caches
  config.cache_store = :dalli_store

  # For Twitter oAuth.
  OpenSSL::SSL::VERIFY_PEER = OpenSSL::SSL::VERIFY_NONE

  # Enable locale fallbacks for I18n (makes lookups for any locale fall back to
  # the I18n.default_locale when a translation can not be found)
  config.i18n.fallbacks = true

  # Enable auto evalution of unrecognized commands
  # for easier debugging in the console (rails console --debug)
  # Default is true for `Rails s --debug`, but false for `rails console --debug`
  # Debugger has issues with TDDium service
  #Debugger.settings[:autoeval] = true


  # Fallback to assets pipeline to compile on-the-fly if a precompiled asset is missed
  # Default for development is true so we don't have to precompile assets
  # Set to false to debug asset compilation/inclusion issues with rake assets:precompile
  # config.assets.compile = false

  # Set the log level from the environment variable.  (ex. info, debug, warn)
  config.log_level = ENV['LOG_LEVEL'].nil? ? :debug : ENV['LOG_LEVEL'].to_sym


end

silence_warnings do
  begin
    require 'pry'
    IRB = Pry
  rescue LoadError
  end
end