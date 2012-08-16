module SiteConfigs
  class Sabs < Site
    def logo_style
      "background: no-repeat 0 10px; width: 133px"
    end

    def logo_image
      'biblesociety-nz.png'
    end

    def title
      'Online Bibles in South African languages'
    end

    def description
      "Read the Bible in English, Afrikaans, Setswana, Sesotho, Sepedi, Tshivenda, Xitsonga, isiXhosa, isiZulu, Swahili, Spanish, Portuguese, Italian, Chinese and more."
    end

    def default_version
      "afr83"
    end

    def donate_path
      "http://www.bybelgenootskap.co.za/support-bible-work/support-bible-work"
    end

    def versions
      [6, 5, 2, 256, 124, 273, 274, 184, 278, 185, 280, 281, 282, 286, 294, 296, 1, 114, 111, 59, 72, 123, 212, 53, 93, 51, 13, 67, 96, 32, 87, 164, 46]
    end

    def partners; end

  end
end
