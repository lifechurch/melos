require File.expand_path('../boot', __FILE__)
require "action_controller/railtie"
require "action_mailer/railtie"
require "active_resource/railtie"
require "sprockets/railtie"
require "rack"
require "rack/mobile-detect"
require "rack/rewrite"
require File.join(File.dirname(__FILE__), '../lib/bb.rb')

require File.expand_path('../_config', __FILE__)
require File.expand_path('../../lib/osis', __FILE__)

if defined?(Bundler)
  # If you precompile assets before deploying to production, use this line
  Bundler.require *Rails.groups(:assets => %w(development test))
  # If you want your assets lazily compiled in production, use this line
  # Bundler.require(:default, :assets, Rails.env)
end

module YouversionWeb
  class Application < Rails::Application
    config.middleware.insert_before(Rack::Lock, Rack::Rewrite) do
      
      # r301 /.*/,  Proc.new {|path, rack_env| "http://#{rack_env['SERVER_NAME'].gsub(/fr\./i, '') }/fr#{path}" },
      #   :if => Proc.new {|rack_env| rack_env['SERVER_NAME'] =~ /fr\./i}
      r301 /.*/,  Proc.new {|path, rack_env| "http://#{rack_env['SERVER_NAME'].gsub(/www/, "m")}#{path}" },
        :if => Proc.new { |rack_env| !rack_env["PATH_INFO"].match(/status/) && !rack_env["X_MOBILE_DEVICE"].nil? }

      ### BIBLE REDIRECTS
      # /bible/verse/niv/john/3/16 (normal)
      r301 %r{/bible/verse/(\w+)/(\w+)/(\w+)/(\w+)}, '/bible/$2.$3.$4.$1'
      # /bible/verse/niv/john/3 (redirects to 1st verse)
      r301 %r{/bible/verse/(\w+)/(\w+)/(\w+)}, '/bible/$2.$3.1.$1'
      # /bible/chapter/niv/john/3 (normal)
      r301 %r{/bible/chapter/(\w+)/(\w+)/(\w+)}, '/bible/$2.$3.$1'
      # /bible/niv/john/3/16 (normal)
      r301 %r{/bible/(\w+)/(\w+)/(\d+)/(\d+)}, '/bible/$2.$3.$4.$1'
      # /bible/john/3/16/niv (user-typed, corrects)
      r301 %r{/bible/(\w+)/(\d+)/(\d+)/(\w+)}, '/bible/$1.$2.$3.$4'
      # /bible/john/3/niv (user-typed, corrects)
      r301 %r{/bible/(\w+)/(\d+)/(\w+)}, '/bible/$1.$2.$3'
      # /bible/kjv (anything without a dot)
      r301 %r{/bible/([a-z-]+)$}, '/versions/$1'

      ### GROUPS/LIVE
      r302 %r{/groups.*}, Proc.new{ |path, rack_env| "http://#{rack_env["SERVER_NAME"].gsub(/youversion/, "a.youversion")}#{path}" } 
      r302 %r{/live.*}, Proc.new{ |path, rack_env| "http://#{rack_env["SERVER_NAME"].gsub(/youversion/, "a.youversion")}#{path}" } 
      r302 %r{/events.*}, Proc.new{ |path, rack_env| "http://#{rack_env["SERVER_NAME"].gsub(/youversion/, "a.youversion")}#{path}" } 
      r302 %r{/free\-bible.*}, Proc.new{ |path, rack_env| "http://#{rack_env["SERVER_NAME"].gsub(/youversion/, "a.youversion")}#{path}" } 

      ### NOTES
      # Ignore SEO text
      rewrite %r{/notes/(\d+)(/edit|/delete)*}, '/notes/$1$2'

      ### READING PLANS
      r301 '/reading-plans/all', '/reading-plans'
      r301 %r{/reading-plans/category/(\w+)/(\w+)/(\w+)}, '/reading-plans?category=$1.$2.$3'
      r301 %r{/reading-plans/category/(\w+)/(\w+)}, '/reading-plans?category=$1.$2'
      r301 %r{/reading-plans/category/(\w+)}, '/reading-plans?category=$1'
      r301 %r{/reading-plans/([\w-]+)/(\d+)}, '/reading-plans/$1?day=$2'

      ### USER
      r301 '/forgot', '/settings/forgot_password'
      
      ### Mobile Downloads
      r301 '/download', '/mobile'
      r301 '/descargar', '/es/download'
      r301 '/app', '/download'
      
      #jmm
      r301 %r{/jmm/subscribe(.*)}, '/reading-plans/199-promises-for-your-everyday-life/start'
    end

    config.middleware.insert_before(Rack::Rewrite, Rack::MobileDetect)
    # config.middleware.insert_before(Rack::MobileDetect, Rack::JSON) do
    #   puts "in"
    #   get '/bb/test.json' do
    #     puts "in bloc"
    #     headers 'Content-type' => 'application/json'
    #     '{"response":{"code":200,"data":{"test":"OK"}},"success":1}'
    #   end
    # end

    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.

    # Custom directories with classes and modules you want to be autoloadable.
    # config.autoload_paths += %W(#{config.root}/extras)
    config.autoload_paths += Dir["#{config.root}/lib/**/"] # include all subdirectories

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
    # config.i18n.default_locale = :de

    # Configure the default encoding used in templates for Ruby 1.9.
    config.encoding = "utf-8"

    # Configure sensitive parameters which will be filtered from the log file.
    config.filter_parameters += [:password]

    # Enable the asset pipeline
    config.assets.enabled = true

    # Version of your assets, change this if you want to expire all your assets
    config.assets.version = '1.0'

    # Setting up memcached.
    config.cache_store = :dalli_store, {namespace: "yv", expires_in: 12.hours, compression: true}
  end
end
