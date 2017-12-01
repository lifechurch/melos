module YV
  module Sites
    class Sbb < Site
      def logo_style
        "background: no-repeat 0 3px; width: 180px"
      end

      def logo_image
        'sites/sbb.png'
      end

      def default_version
        211
      end

      def donate_path
        "http://www.sbb.org.br/interna.asp?areaID=127"
      end

      def skip_splash
        true
      end

      def default_locale
        :'pt'
      end

      def versions
        [211, 212, 277]
      end

      def partners; end

    end
  end
end