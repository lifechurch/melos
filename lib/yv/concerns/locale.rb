module YV
  module Concerns
    module Locale

      private

      # Set locale
      def set_locale_and_timezone
        Time.zone = client_settings.time_zone || "GMT"
        I18n.default_locale = @site.default_locale || :en

        # grab available locales as array of strings and compare against strings.
        available_locales = I18n.available_locales.map {|l| l.to_s}
        visitor_locale    = params[:locale] if available_locales.include?(params[:locale])
        from_param        = visitor_locale.present?

        visitor_locale ||= cookies[:locale] if cookies[:locale].present? and available_locales.include?(cookies[:locale])
        visitor_locale ||= @site.default_locale
        visitor_locale ||= request.preferred_language_from(I18n.available_locales)
        visitor_locale ||= request.compatible_language_from(I18n.available_locales)
        visitor_locale ||= I18n.default_locale
        visitor_locale = visitor_locale.to_sym

        set_locale(visitor_locale)
        # available_locales are set for some one-off sites
        set_available_locales(@site.available_locales.present? ? @site.available_locales : I18n.available_locales)

        # redirect to either:
        # a) remove locale from path if default and present
        # b) user's locale if not default and not in url already

        return redirect_to params.merge!(locale: "") if from_param && visitor_locale == I18n.default_locale
        return redirect_to params.merge!(locale: visitor_locale) if !from_param && visitor_locale != I18n.default_locale
      end

      def set_locale(loc)
        I18n.locale = cookies.permanent[:locale] = loc
        if loc.is_a? Symbol
          FastGettext.locale = loc.to_s.gsub("-", "_")
        elsif loc.is_a? String
          FastGettext.locale = loc.gsub("-", "_")
        end
      end

      def set_available_locales(locs)
        I18n.available_locales = locs

        logger.info ""
        logger.info "I18n Available Locales"
        logger.info "-----------------------------"
        logger.info I18n.available_locales
        logger.info "-----------------------------"

        logger.info ""
        logger.info "FastGettext Default Locales"
        logger.info "-----------------------------"
        logger.info FastGettext.default_available_locales
        logger.info "-----------------------------"

        logger.info ""
        logger.info "FastGettext Available Locales Pre-set"
        logger.info "-----------------------------"
        logger.info FastGettext.available_locales
        logger.info "-----------------------------"


        available_locales = []
        I18n.available_locales.each do |loc|
          if loc.is_a? String
            available_locales << loc.gsub("-", "_")
          elsif loc.is_a? Symbol
            available_locales << loc.to_s.gsub("-", "_")
          end
        end
        FastGettext.available_locales = available_locales

        logger.info ""
        logger.info "FastGettext Available Locales Post-set"
        logger.info "-----------------------------"
        logger.info FastGettext.available_locales
        logger.info "-----------------------------"
      end

    end
  end
end
