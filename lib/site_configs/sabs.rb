module SiteConfigs
  class Sabs < Site
    def logo_style
      "background: no-repeat 0 10px; width: 133px"
    end

    def logo_image
      'biblesociety-nz.png'
    end

    def title
      'Bible Society of South Africa - Online Bible from YouVersion'
    end

    def description
      "The Bible Society would like to encourage people to read the Bible and allow them to have access to the Bible in the language of their choice. The printed Bible is not always at hand, but, since you're already online, the Word of God is only a few mouse clicks away."
    end

    def default_version
      "afr83"
    end

    def donate_path
      "http://www.bybelgenootskap.co.za/support-bible-work/support-bible-work"
    end

    def versions
      ['afr83', 'afr53-af', 'abd07-af', 'nso00-nso', 'nso51-nso', 'sso61so-st', 'sso89so-st', 'tso89-ts', 'tsw08no-tn', 'tsw70-tn', 'ven98-ve', 'xho75-xh', 'xho960xh', 'zul59-zu', 'cevuk-en', 'gntuk-en', 'kjv', 'nkjv', 'niv', 'esv', 'hcsb', 'nr94', 'arc_1-pt', 'dhhe-es', 'lsg-fr', 'delut', 'avd-ar', 'gna93-ar', 'mg1865', 'bsn-sna', 'kqa', 'suv-sw', 'cunp']
    end

    def partners; end

  end
end
