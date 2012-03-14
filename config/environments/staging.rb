YouversionWeb::Application.configure do
  # Settings specified here will take precedence over those in config/application.rb
  config.middleware.insert_after(::Rack::Lock, "::Rack::Auth::Basic", "Staging") do |u, p|
    [u, p] == ['youversion', 'yv123']
  end
  # In the development environment your application's code is reloaded on
  # every request.  This slows down response time but is perfect for development
  # since you don't have to restart the web server when you make code changes.
  config.cache_classes = false

  # Log error messages when you accidentally call methods on nil.
  config.whiny_nils = true

  # Show full error reports and disable caching
  config.consider_all_requests_local       = true
  config.action_controller.perform_caching = true

  # Don't care if the mailer can't send
  config.action_mailer.raise_delivery_errors = false

  # Print deprecation notices to the Rails logger
  config.active_support.deprecation = :log

  # Only use best-standards-support built into browsers
  config.action_dispatch.best_standards_support = :builtin

  # Do not compress assets
  config.assets.compress = false

  # Don't fallback to assets pipeline if a precompiled asset is missed
  config.assets.compile = false

  # Generate digests for assets URLs
  config.assets.digest = true

  # Expands the lines which load the assets
  config.assets.debug = true
  config.cache_store = :dalli_store

  # Enable serving of images, stylesheets, and JavaScripts from an asset server
  config.action_controller.asset_host = Proc.new do |*args|
    source, request = args
    if request.try(:ssl?)
      "https://#{ENV['FOG_DIRECTORY']}.s3.amazonaws.com"
    else
      "http://#{ENV['FOG_DIRECTORY']}.s3.amazonaws.com"
    end
  end

  # Precompile additional assets (application.js, application.css, and all non-JS/CSS are already added)
  config.assets.precompile += %w( ie7.css ie8.css ie9.css wysiwyg/jquery.wysiwyg.css wysiwyg/jquery.wysiwyg.js wysiwyg/editor.css donate.css status.css )

end

silence_warnings do
  begin
    require 'pry'
    IRB = Pry
  rescue LoadError
  end
end
