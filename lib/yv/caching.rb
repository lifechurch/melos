# See /config/_config.yml

module YV
  module Caching
    
    class << self

      #Generates Cache Key
      def cache_key(path, opts={})
        puts path
        puts opts.to_s
        [path, opts[:query].sort_by{|k,v| k.to_s}].flatten.join("_")
      end

      # 720 minutes - 12 hours
      def a_very_long_time
        @very_long_time ||= Cfg.very_long_cache_expiration.to_f.minutes
      end

      # 240 minutes - 4 hours
      def a_longer_time
        @longer_time ||= Cfg.longer_cache_expiration.to_f.minutes
      end
      
      # 45 minutes
      def a_long_time
        @long_time ||= Cfg.long_cache_expiration.to_f.minutes
      end
      
      # 10 minutes
      def a_short_time
        @short_time ||= Cfg.short_cache_expiration.to_f.minutes
      end

      # 2 minutes
      def a_very_short_time
        @very_short_time ||= Cfg.very_short_cache_expiration.to_f.minutes
      end
    end

  end
end
