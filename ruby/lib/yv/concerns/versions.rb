module YV
  module Concerns
    module Versions

      def self.included(base)
        base.helper_method :recent_versions, :current_version, :alt_version, :versions_for_current_language
      end

      private

      def recent_versions
        return @recent_versions if @recent_versions.present?
        return [] if cookies[:recent_versions].blank?

        @recent_versions = cookies[:recent_versions].split('/').map{|v| Version.find(v) rescue nil}.compact.uniq
        # Handle conversion from API2 (osis) to API3 (version_ids)
        # But not a bad idea in general to validate/curate user's recent versions
        cookie_value = @recent_versions.map{|v| v.to_id}.join('/') rescue nil
        cookies[:recent_versions] = { value: cookie_value, domain: cookie_domain }
        @recent_versions
      end

      # TODO: Make this return a version instance, not just the id (#to_param).
      # Will require looking at all code that calls #current_version and adjusting accordingly
      def current_version
        return @current_version if @current_version.present?

        lookup_id = client_settings.version || @site.default_version || Version.default_for(params[:locale].try(:to_s) || I18n.default_locale.to_s)
        # check to make sure it's a valid version (handling version deprecation)
        @current_version = Version.find(lookup_id).to_id rescue Version.default
      end

      def versions_for_current_language
        primary_locale ||= I18n.locale.to_s
        @versions_for_current_lang = Version.by_language({:only => primary_locale})
      end

      # TODO: Refactor alt version functionality
      def alt_version(ref)
        #Cookie may have empty string for some reason -- possibly previous error case
        cookies[:alt_version] = { value: nil, domain: cookie_domain } if cookies[:alt_version].blank?

        if cookies[:alt_version].present?

          # validate that the preferred secondary version has the reference in question
          begin
            Version.find(cookies[:alt_version]).include?(ref)
          # Catch versions that don't exist and raise proper error
          rescue NotAVersionError
            cookies[:alt_version] = { value: nil, domain: cookie_domain } # nuke the bad cookie. BAD COOKIE!
            raise NoSecondaryVersionError
          # rescue anything else, nuke cookie
          rescue
            cookies[:alt_version] = { value: nil, domain: cookie_domain } # nuke the bad cookie. BAD COOKIE!
          end
        end
        # if we have an alt_version at this point, let's return it.
        return cookies[:alt_version] if cookies[:alt_version].present?

        # new user or bad version was in cookie
        # Find recent version that is not the current version and includes ref.
        recent = recent_versions.find{|v| v.to_id != current_version && v.include?(ref)}
        cookies[:alt_version] = { value: recent.to_id, domain: cookie_domain } if recent

        # Nothing? Okay let's call sample_for with locale, version and validating ref
        cookie_value = Version.sample_for((params[:locale] || "en"), except: current_version, has_ref: ref)
        cookies[:alt_version] ||= { value: cookie_value, domain: cookie_domain }

        # Still nothing? Let's fall back to KJV.  This is secondary version that they can switch at any time.
        cookie_value = Version.find(1).id
        cookies[:alt_version] ||= { value: cookie_value, domain: cookie_domain }

        # If were still blank, we've got problems
        raise NoSecondaryVersionError if cookies[:alt_version].blank?

        cookies[:alt_version]
      end

    end
  end
end
