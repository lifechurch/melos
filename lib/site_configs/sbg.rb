module SiteConfigs
  class Sbg < Site
    def logo_style
      "background: no-repeat 0 6px; width: 113px"
    end

    def logo_image
      'sites/sbg.png'
    end

    def default_version
      149
    end

    def skip_splash
      true
    end

    def default_locale
      :es
    end

    def allow_donate?
        false
    end

    def versions
      [28, 52, 53, 89, 103, 127, 128, 146, 147, 149, 150, 176, 178, 197, 210, 214, 222, 411, 442, 489, 490, 491, 492, 493, 494, 495]
    end

    def partners; end

  end
end
