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
require File.join(File.dirname(__FILE__), '../lib/yv_logger.rb')

require File.expand_path('../_config', __FILE__)

if defined?(Bundler)
  # If you precompile assets before deploying to production, use this line
  Bundler.require *Rails.groups(assets: %w(development test))
  # If you want your assets lazily compiled in production, use this line
  # Bundler.require(:default, :assets, Rails.env)
end

module YouversionWeb
  class Application < Rails::Application
    config.middleware.insert_before(Rack::Lock, Rack::Rewrite) do

      #high frequency BB traffic
      r301 %r{^/(bb|js)/(.+)}, 'http://bb-static.youversion.com/$1/$2'

      # re-direct Bible.com /mobile and /download traffic to youversion for SEO
      r301 %r{^(/.{2,5})?(/download$|/mobile$|/app$|/iphone$|/bb$|/android$|/descargar$|/donate.*$)}, 'http://www.youversion.com$1$2', if: Proc.new{|rack_env| rack_env["SERVER_NAME"] =~ /^(?:(?:.*\.)?bible\.com|lvh\.me)/}

      # re-route /download redirects before the legacy mobile redirects so the mobile redirects to app stores work
      r301 '/descargar', '/es/download'
      r301 %r{^(/.{2,5})?(/app$|/iphone$|/bb$|/android$)}, '$1/download' #without $ or {2,5} application.css gets 301'd to a black hole on dev

      # engagement site (pre mobile redirect)
      r301 %r{^(/.{2,5})?(/now$)}, 'http://now.youversion.com'

      # lifekids redirect
      r301 %r{^(/.{2,5})?(/lifekids$)}, '$1/reading-plans?category=family'

      # r301 /.*/,  Proc.new {|path, rack_env| "http://#{rack_env['SERVER_NAME'].gsub(/fr\./i, '') }/fr#{path}" },
      #   if: Proc.new {|rack_env| rack_env['SERVER_NAME'] =~ /fr\./i}
      #
      #   Mobile
      mobile_rewrite = lambda do |path, rack_env|
        new_path = path.to_s
        new_server_name = rack_env['SERVER_NAME']
        # THIS IS HARD-CODED; UPDATE WITH ADDITIONAL LOCALES -- Kill this as soon as mobile is live, obviously
        locales = {"en" => "en",
                   "de" => "de",
                   "es" => "es",
                   "fr" => "fr",
                   "ko" => "ko",
                   "nl" => "nl",
                   "no" => "no",
                   "pt-BR" => "pt",
                   "ru" => "ru",
                   "zh-CN" => "zh-cn",
                   "zh-TW" => "zh-tw"}

        # url = "http://#{rack_env['SERVER_NAME'].gsub(/www/, "m")}"
        new_server_name = "m.youversion.com"

        # bible.us paths: /es/bible/12/jhn3.16-17,19,21.esv
        # mDot paths: http://es.m.youversion.com/bible/asv/john/3/16-17

        # locales
        if (new_path.present? && new_path != "/")
          # then there's a path, see if it's a locale
          test = new_path.split("/")[1]
          if locales[test]
            new_server_name = locales[test] + "." + new_server_name
            new_path_array = new_path.split("/")
            new_path_array.delete_at(1)
            new_path = new_path_array.join("/")
          end
        end

        # reform url for mDot
        case new_path
        when /^\/bible\/(?:(\d+)\/)?(\w{3})\.?([^\.]+)(?:(?:\.([,\w-]+))?)\.(\w+)/
          new_path = nil
          book = YvApi::get_osis_book($2)
          version = YvApi::get_osis_version($1) || $5 || 'kjv'
          chapter = $3
          verses = $4

          (chapter = 1 && book = 'john') if book.blank?
          new_path = "/bible/verse/#{version.downcase}/#{book}/#{chapter}/#{verses}" if verses.present?
          new_path ||= "/bible/#{version.downcase}/#{book}/#{chapter}"

        when /^\/reading-plans\/\d+-([^\/]*)/
          new_path = "/reading-plans/#{$1}"
        when /^\/reading-plans\?.*category=([^&\/]*)/
          new_path = "/reading-plans/category/#{$1}"
        end

        "http://#{new_server_name}#{new_path}"
      end

      should_rewrite_mobile = Proc.new do |rack_env|
        # forward to mDot if a mobile device and not: notifications, terms/privacy, or status pages, assets (for staging and local dev)
        mobile = !rack_env["X_MOBILE_DEVICE"].nil? && rack_env["PATH_INFO"] !~ /(\/settings\/notifications|^(\/.{2,5})?\/terms|privacy|^\/status$|^\/assets\/)/
        # don't forwards to mDot if bible.com root
        mobile = false if rack_env["SERVER_NAME"] =~ /^(?:(?:.*\.)?bible\.com|lvh\.me)/ && rack_env["PATH_INFO"] =~ /^\W*$/
        mobile
      end

      r301 /.*/, mobile_rewrite, if: should_rewrite_mobile

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
      r301 %r{^/(pt)/(.*)}, '/pt-BR/$2'
      r301 %r{^/(es_MX|es-MX|es_ES|es-ES)/(.*)}, '/es/$2'

      ### Pass-through to 2.0
      # doesn't have SSL cert, use http protocol
      r302 %r{^(\/(.{2}|(.{2}[_-].{2})))?\/(groups|live|events|free\-bible|widgets|google).*}, Proc.new{ |path, rack_env| "http://www.a.youversion.com#{path}" }

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

      ### Mobile Downloads
      r301 %r{^(/.{2,5})?(/download$)}, '$1/mobile'

      #jmm
      r301 %r{/jmm/subscribe(.*)}, '/reading-plans/199-promises-for-your-everyday-life/start'

      #force HTTPS traffic
      r301 /.*/, Proc.new{ |path, rack_env| "https://#{rack_env["SERVER_NAME"]}#{path}" }, if: Proc.new{ |rack_env| rack_env["rack.url_scheme"] != 'https' && ENV['SECURE_TRAFFIC']}
    end

    config.middleware.insert_before(Rack::Rewrite, Rack::MobileDetect)

    # rate limit clients to 2 req/sec sustained
    # (only on production or staging where we have external assets)
    if ENV['FOG_DIRECTORY']
      config.middleware.use  Rack::Throttle::Minute, :max => (Cfg.rate_limit).to_i, cache: Dalli::Client.new, :key_prefix => :throttle
    end

    #handle high-frequency bb/test.json (etc) traffic in middleware so app isn't fully loaded
    config.middleware.insert_before(Rack::MobileDetect, Bb::EndPoint)

    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.

    # Custom directories with classes and modules you want to be autoloadable.
    # config.autoload_paths += %W(#{config.root}/extras)
    config.autoload_paths += Dir["#{config.root}/lib/**/"] # include all subdirectories
    config.autoload_paths += %W(#{config.root}/app/presenters)

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
    #config.i18n.available_locales = [:de, :en, :es, :fr, :ja, :ko, :nl, :no, :pl, "pt-BR", :ru, :sv, "zh-CN", "zh-TW"]

    # Configure sensitive parameters which will be filtered from the log file.
    config.filter_parameters += [:password]

    # Don't load rails environment during asset precompilation
    config.assets.initialize_on_precompile = false

    # Enable the asset pipeline
    config.assets.enabled = true

    # Version of your assets, change this if you want to expire all your assets
    config.assets.version = '1.0'

    # Setting up memcached.
    config.cache_store = :dalli_store, {namespace: "yv", expires_in: 12.hours, compression: true}
  end
end
