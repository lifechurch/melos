require File.expand_path('../boot', __FILE__)
require "action_controller/railtie"
require "action_mailer/railtie"
require "active_resource/railtie"
require "sprockets/railtie"
require "rack"
require "rack/mobile-detect"
require "rack/rewrite"
require 'rack/throttle'

require File.join(File.dirname(__FILE__), '../lib/bb.rb')
#require File.join(File.dirname(__FILE__), '../lib/yv_logger.rb')

require File.expand_path('../_config', __FILE__)

if defined?(Bundler)
  # If you precompile assets before deploying to production, use this line
  Bundler.require *Rails.groups(assets: %w(development test))
  # If you want your assets lazily compiled in production, use this line
  # Bundler.require(:default, :assets, Rails.env)
end

module YouversionWeb
  class Application < Rails::Application

    # lots of unexpected 300/404s for assets we don't host. Blackberry/Appworld?
    halt_for = /^\/webstore/

    config.middleware.insert_before(Rack::Lock, "YV::Middleware::Halt", routes: halt_for)

    config.middleware.insert_after(
      "YV::Middleware::Halt",
      Rack::SslEnforcer,
      ignore: ['/app', '/download', '/mobile', '/100million'],
      except_hosts: ['127.0.0.1', 'local.bible.com', 'assets.bible.com', 'staging.bible.com', 'review01.bible.com', 'nic.bible.com', 'american.bible.com'],
      except_environments: [ 'development' ]
    )

    #handle high-frequency bb/test.json (etc) traffic in middleware so app isn't fully loaded
    config.middleware.insert_after(Rack::SslEnforcer, Bb::EndPoint)

    config.middleware.insert_after(
      Bb::EndPoint,
      Rack::MobileDetect,
      targeted: /Android|android|iPhone|iphone|iPod|ipod|iPad|ipad|BlackBerry|blackberry|Silk|silk|SymbianOS|symbian|Symbian|J2ME|Windows Phone OS|webOS|hpwOS/
    )

    config.middleware.insert_after(Rack::MobileDetect, Rack::Rewrite) do

      r301 %r{^\/webcast}, "http://webcast.youversion.com/index.html"

      # /app redirects
      r301 %r{^\/download$|^\/mobile$}, '/app'
      r301 %r{^\/iphone$|^\/bb$|^\/android$}, '/app' #without $ or {2,5} application.css gets 301'd to a black hole on dev
      r301 %r{^\/descargar},         "/es/app"

      # lifekids redirect
      r301 %r{^(/.{2,5})?(/lifekids$)}, '$1/reading-plans?category=family'

      ### BIBLE REDIRECTS
      # /bible/john.3.16-17,19,21.ESV (legacy web3 API2 links, verse(s) optional)
      r301 %r{/bible/(\w+)\.(\d+(?:(?:\.[,\d-]+)?))\.(\w+)}, '/bible/$3/$1.$2.$3'
      # /bible/verse/niv/john/3/16 (normal)
      r301 %r{/bible/verse/([\w-]+)/(\w+)/(\w+)/([,\w-]+)}, '/bible/$2.$3.$4.$1'
      # /bible/verse/niv/john/3 (redirects to 1st verse)
      r301 %r{/bible/verse/([\w-]+)/(\w+)/(\w+)}, '/bible/$2.$3.1.$1'
      # /bible/chapter/niv/john/3 (normal)
      r301 %r{/bible/chapter/([\w-]+)/(\w+)/(\w+)}, '/bible/$2.$3.$1'
      # /bible/niv/john/3/16 (normal)
      r301 %r{/bible/([\w-]+)/(\w+)/(\d+)/([,\d-]+)}, '/bible/$2.$3.$4.$1'
      # /bible/john/3/16/niv (user-typed, corrects)
      r301 %r{/bible/(\w+)/(\d+)/([,\d-]+)/([\w-]+)}, '/bible/$1.$2.$3.$4'
      # /bible/john/3/niv (user-typed, corrects)
      r301 %r{/bible/(\w+)/(\d+)/([\w-]+)}, '/bible/$1.$2.$3'
      # /bible/kjv (anything without a dot)
      r301 %r{/bible/([a-z-]+)$}, '/versions/$1'
      # /bible/1/john3.16-17,19,21.ESV (possible API3 short links, verse(s) optional)
      r301 %r{/bible/(\d+)/(\w{3})(\d+(?:(?:\.[,\d-]+)?))\.(\w+)}, '/bible/$1/$2.$3.$4'

      #blogs and other misc redirects
      r301 '/churches', 'http://blog.youversion.com/churches'
      r301 '/google', 'http://www.google.com/ig/directory?hl=en&url=www.youversion.com/google/youversion2.xml'

      #legacy localizations
      r301 %r{^/(zh_CN|zh_TW|pt_BR)/(.*)}, Proc.new{ |path, rack_env| "#{path.to_s.sub('_', '-')}" }
      # redirect portugese and espanol URLs (from apps) until we support es-ES
      r301 %r{^/(es_MX|es-MX)/(.*)}, '/es/$2'

      ### Pass-through to 2.0
      # doesn't have SSL cert, use http protocol
      r302 %r{^(\/(.{2}|(.{2}[_-].{2})))?\/(groups|live|free\-bible|widgets|google).*}, Proc.new{ |path, rack_env| "http://www.a.youversion.com#{path}" }

      ### NOTES
      # Ignore SEO text
      rewrite %r{^(/.{2,5})?/notes/(\d+)(/edit|/delete)*}, '$1/notes/$2$3'

      ### READING PLANS
      r301 '/reading-plans/all', '/reading-plans'
      r301 %r{/reading-plans/category/(\w+)/(\w+)/(\w+)}, '/reading-plans?category=$1.$2.$3'
      r301 %r{/reading-plans/category/(\w+)/(\w+)}, '/reading-plans?category=$1.$2'
      r301 %r{/reading-plans/category/(\w+)}, '/reading-plans?category=$1'
      r301 %r{/reading-plans/([\w-]+)/(\d+)}, '/reading-plans/$1?day=$2'
      #Temporary for ACE fix on 3-21
      r301 '/reading-plans/prayer', '/reading-plans/55-prayer'
      #Temp fix for Piper release 6-27
      r301 '/reading-plans/15-days-in-the-word-with-john-piper', '/reading-plans/318-15-days-in-the-word-with-john-piper'

      ### USER
      r301 '/forgot', '/settings/forgot_password'

      #jmm
      r301 %r{/jmm/subscribe(.*)}, '/reading-plans/199-promises-for-your-everyday-life/start'
    end

    # rate limit clients to 2 req/sec sustained
    # (only on production or staging where we have external assets)
    if ENV['FOG_DIRECTORY'] && ENV['THROTTLE_REQUESTS']
      config.middleware.use  Rack::Throttle::Minute, :max => (Cfg.rate_limit).to_i, cache: Dalli::Client.new, :key_prefix => :throttle
    end

    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.

    # Custom directories with classes and modules you want to be autoloadable.
    # config.autoload_paths += %W(#{config.root}/extras)
    config.eager_load_paths += Dir["#{config.root}/lib/**/"] # include all subdirectories
    # config.eager_load_paths += %W(#{config.root}/app/presenters)


    # Only load the plugins named here, in the order given (default is alphabetical).
    # :all can be used as a placeholder for all plugins not explicitly named.
    # config.plugins = [ :exception_notification, :ssl_requirement, :all ]

    # Activate observers that should always be running.
    # config.active_record.observers = :cacher, :garbage_collector, :forum_observer

    # Set Time.zone default to the specified zone and make Active Record auto-convert to this zone.
    # Run "rake -D time" for a list of tasks for finding time zone names. Default is UTC.
    # config.time_zone = 'Central Time (US & Canada)'

    # The default locale is :en and all translations from config/locales/*.rb,yml are auto loaded.
    # config.i18n.load_path += Dir[Rails.root.join('my', 'locales', '*.{rb,yml}').to_s]
    config.i18n.load_path += Dir[Rails.root.join('config', 'locales', '**', '*.{rb,yml}')]
    # config.i18n.default_locale = :de

    # Configure the default encoding used in templates for Ruby 1.9.
    config.encoding = "utf-8"

    # Set available locales to only the files we have in /config/locales (otherwise we would get everything in rails-i18n gem)
    # disabled since we're manually using the files
    config.i18n.available_locales = [
      :af, :ar, :be, :bg, :bn, :ca, :cs, :cy, :da, :de, :el, :en,
      :es, :et, :fa, :fi, :fr, :he, :hi, :hr, :ht, :hu, :id, :ig,
      :is, :it, :ja, :ka, :km, :kn, :ko, :lt, :lv, :mk, :ml, :mn,
      :mr, :ms, :my, :ne, :nl, :no, :pl, :pt, :ro, :ru, :sk, :sn,
      :sq, :sv, :sw, :ta, :tg, :th, :tl, :tr, :uk, :ur, :uz, :vi,
      :ckb, :myz,
      "en-GB", "es-ES", "pt-PT", "zh-CN", "zh-HK", "zh-TW", :zu
    ]

    # Configure sensitive parameters which will be filtered from the log file.
    config.filter_parameters += [:password]

    # Don't load rails environment during asset precompilation
    config.assets.initialize_on_precompile = true

    # Enable the asset pipeline
    config.assets.enabled = true

    # Version of your assets, change this if you want to expire all your assets
    config.assets.version = '1.0'

    # Setting up memcached.
    config.after_initialize do
      config.cache_store = :dalli_store, {namespace: "yv", expires_in: 24.hours, compression: true}
    end

  end
end
