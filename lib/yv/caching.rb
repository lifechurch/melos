# See /config/_config.yml

module YV
  module Caching
    
    class << self

      # 720 minutes - 12 hours
      def a_very_long_time
        @very_long_time ||= Cfg.very_long_cache_expiration.to_f.minutes
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