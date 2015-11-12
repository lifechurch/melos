module YV
  module Sites
    class Bible < Site

      def donate_path
        "/donate"
      end

      def title
        "Bible.com"
      end

      def description
        "Bible.com is all new! Enjoy a free online Bible from YouVersion. Now, the simple, ad-free Bible experience loved by millions is available at Bible.com."
      end

      def ga_code
        'UA-3571547-76'
      end

      def ga_parallel_code
        # using this site id temporarily while testing/transitioning to Google Universal analytics
        'UA-3571547-115'
      end

      def ga_domain
        'bible.com'
      end

      def to_s
        "Bible(dot)com"
      end

    end
  end
end
