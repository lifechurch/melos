module YV
  module Sites
    class ElSalvador < Site
      def logo_style
        "background: no-repeat 0 10px; width: 158px"
      end

      def logo_image
        'sites/biblesocietywebsite.png'
      end

      def default_version
        149
      end

      def partners; end
    end
  end
end
