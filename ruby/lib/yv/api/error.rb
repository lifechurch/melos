module YV
  module API
    class Error

      def self.i18nize(e)
        key_string = "api.".concat(e.key.gsub(/[._]/, ' '))
        return I18n.t( key_string , default: e.error)
      end

      attr_accessor :key, :error

      # {"response":{"code":404,"data":{"errors":[{"key":"badges.badges.not_found","error":"Badges not found"}]},"buildtime":"2013-09-04T14:05:20+00:00"}}
      def initialize(api_error_hash)
        @hash   = api_error_hash
        @key    = hash["key"]
        @error  = hash["error"]
      end

      def i18nize
        self.class.i18nize(self)
      end

      private

      def hash
        @hash
      end

    end
  end
end