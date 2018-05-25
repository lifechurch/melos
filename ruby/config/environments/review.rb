# require 'rack-cache'
YouversionWeb::Application.configure do
  # Settings specified here will take precedence over those in config/application.rb
  unless ENV['NO_AUTH']
    config.middleware.insert_after(::Rack::Lock, "BasicAuth", "Review") do |u, p|
      [u, p] == ['youversion', 'yv123']
    end
  end

  # Code is not reloaded between requests
  config.cache_classes = true

  # Full error reports are disabled and caching is turned on
  config.consider_all_requests_local       = false
  config.action_controller.perform_caching = true

  # Disable Rails's static asset server (Apache or nginx will already do this)
  config.serve_static_assets = false

  # Don't fallback to assets pipeline if a precompiled asset is missed
  config.assets.compile = false

  #### REENABLE ...

  # Enable serving of images, stylesheets, and JavaScripts from an asset server
  #config.action_controller.asset_host = "#{ENV['SECURE_TRAFFIC'] ? 'https' : 'http'}://#{Cfg.review_host}"
  # puts "ENV['SECURE_TRAFFIC'] => #{ENV['SECURE_TRAFFIC']}"

  # Compress JavaScripts and CSS into one file for each
  config.assets.compress = true



  # Generate digests for assets URLs
  config.assets.digest = true

  # Defaults to Rails.root.join("public/assets")
  # config.assets.manifest = YOUR_PATH

  # Specifies the header that your server uses for sending files
  # config.action_dispatch.x_sendfile_header = "X-Sendfile" # for apache
  # config.action_dispatch.x_sendfile_header = 'X-Accel-Redirect' # for nginx

  # Force all access to the app over SSL, use Strict-Transport-Security, and use secure cookies.
  #config.force_ssl = false

  # The available log levels are: :debug, :info, :warn, :error, :fatal
  # corresponding to the log level numbers from 0 up to 4 respectively
  # production is set to :info by default
  config.log_level = ENV["LOG_LEVEL"].to_sym if %w(debug info warn error fatal).include? ENV["LOG_LEVEL"]

  # Use a different logger for distributed setups
  # config.logger = SyslogLogger.new

  # Use a different cache store in production
  config.cache_store = :dalli_store


  # Precompile additional assets (application.js, application.css, and all non-JS/CSS are already added)
  config.assets.precompile += %w(application-rtl.css ie7.css ie8.css ie9.css donate.css status.css mobile.css mobile/donate.css bdc_home.css campaigns/kids.css retina.js campaigns/100m.css campaigns/100m/jquery.counter.js campaigns/100m/jquery.countdown.min.js slick.css  campaigns/christmas/polymaps.min.js campaigns/christmas/plugins.js campaigns/christmas.css jw/jwplayer.js jw/jwplayer.html5.js angular/angular.min.js angular/app.js tupos/babel-polyfill.min.js tupos/OAuth.bundle.js tupos/User.bundle.js)
  # Precompile JS locale files
  config.assets.precompile += ['i18n/*']
  # events css/js
  config.assets.precompile += %w( features/events/flexslider.css features/events/jquery.fullPage.css features/events/responsive.css features/events/style.css features/events/attrchange.js features/events/classie.js features/events/global.js features/events/jquery.flexslider.js features/events/jquery.fullPage.js features/events/jquery.lazy.min.js features/events/jquery.smooth-scroll.js features/events/retina.min.js)

  # Disable delivery errors, bad email addresses will be ignored
  # config.action_mailer.raise_delivery_errors = false

  # Enable threaded mode
  #config.threadsafe!

  # Enable locale fallbacks for I18n (makes lookups for any locale fall back to
  # the I18n.default_locale when a translation can not be found)
  config.i18n.fallbacks = true

  # Send deprecation notices to registered listeners
  config.active_support.deprecation = :notify

  # Enable Rack::Cache
  # config.middleware.use Rack::Cache, :metastore => "memcached://#{ENV['MEMCACHE_SERVERS']}/meta", :entitystore => "memcached://#{ENV['MEMCACHE_SERVERS']}/body", :verbose => true
  config.action_dispatch.rack_cache =  nil

  # Add HTTP headers to cache static assets for an hour
  config.static_cache_control = "public, max-age=3600"
end
