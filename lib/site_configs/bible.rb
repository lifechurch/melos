# encoding: UTF-8
module SiteConfigs
  class Bible < Site

    def donate_path
      "http://www.youversion.com/donate"
    end

    def title
      "Bible.com"
    end

    def description
      "Bible.com is all new! Enjoy a free online Bible from YouVersion. Now, the simple, ad-free Bible experience loved by millions is available at Bible.com."
    end

    def to_s
      "Bible(dot)com"
    end

  end
end
