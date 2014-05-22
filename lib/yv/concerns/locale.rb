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
        if @site.available_locales.present?
          I18n.available_locales = @site.available_locales
        end

        # redirect to either:
        # a) remove locale from path if default and present
        # b) user's locale if not default and not in url already

        return redirect_to params.merge!(locale: "") if from_param && visitor_locale == I18n.default_locale
        return redirect_to params.merge!(locale: visitor_locale) if !from_param && visitor_locale != I18n.default_locale
      end

      def set_locale(loc)
        FastGettext.locale = I18n.locale = cookies.permanent[:locale] = loc
      end

      def set_available_locales(locs)
        FastGettext.available_locales = I18n.available_locales = locs
      end

    end
  end
end