module YV
  module API
    class Error

      def self.i18nize(error)
        I18n.t("api.".concat(error['key'].gsub(/[._]/, ' ')), default: error['error'])
      end

    end
  end
end