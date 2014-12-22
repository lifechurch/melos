# encoding: UTF-8
module YV
  module Sites

    class Site
      def logo_style
        "background: no-repeat 0 12px; width: 150px; display: block; text-indent: -99999px"
      end

      def logo_image
        'yv_logo.png'
      end

      def title
        'Bible.com'
      end

      def description
        'Bible.com is the online Bible website for YouVersion, makers of the free Bible App™, with all of the same tools: Bookmarks, Plans, Notes, and more.'
      end

      def ga_code
        'UA-351257-4'
      end

      def ga_domain
        'bible.com'
      end

      def skip_splash; end

      def default_version; end

      def default_locale; end

      def available_locales; end

      def allow_donate?
          true
      end

      def donate_path; end

      def versions; end

      def partners #this static content will eventually come from the API, putting it here for now as white-labels could have issue

        partners = {:en      => [{name: 'American Bible Society', url: 'http://www.americanbible.org/', image: 'partners/ABS.jpg'},
                                  {name: 'Bible League International', url: 'http://www.bibleleague.org', image: 'partners/bli.gif'},
                                  {name: 'Biblica', url: 'http://www.biblica.com', image: 'partners/biblica.png'},
                                  {name: 'Common English Bible', url: 'http://www.commonenglishbible.com', image: 'partners/commonenglish.jpg'},
                                  {name: 'Crossway', url: 'http://www.esv.org', image: 'partners/crossway.jpeg'},
                                  {name: 'God’s Word Translation', url: 'http://www.godswordtranslation.org', image: 'partners/gwt.jpg'},
                                  {name: 'Holman Bible Publishers', url: 'http://www.HCSB.org', image: 'partners/hcsb.jpg'},
                                  {name: 'The Lockman Foundation', url: 'http://www.nasbible.com', image: 'partners/lockman.jpg'},
                                  {name: 'Logos Bible Software', url: 'http://www.logos.com/?utm_source=youversion.com&utm_medium=aboutpage&utm_content=buttonlink&utm_campaign=youversion', image: 'partners/LOGOS.png'},
                                  {name: 'NavPress', url: 'http://navpress.com/', image: 'partners/NavPress.gif'},
                                  {name: 'NET Bible', url: 'http://bible.org/', image: 'partners/netbible.jpg'},
                                  {name: 'Tyndale', url: 'http://www.newlivingtranslation.com/', image: 'partners/nlt.jpeg'},
                                  {name: 'United Bible Societies', url: 'http://unitedbiblesocieties.org', image: 'partners/en-ubs.jpg'},
                                  {name: 'Zondervan', url: 'http://zondervan.com/bibles', image: 'partners/zondervan.jpg'}],
                    :"pt-BR"  => [{name: 'Sociedade Bíblica do Brasil', url: 'http://www.sbb.org.br', image: 'partners/sbb.png'},
                                  {name: 'Bible League International', url: 'http://www.bibleleague.org', image: 'partners/bli.gif'},
                                  {name: 'Biblica', url: 'http://www.biblica.com', image: 'partners/biblica.png'}],
                    :"sv"     => [{name: 'Biblica', url: 'http://www.biblica.com', image: 'partners/biblica.png'},
                                  {name: 'Svenska Folkbibeln', url: 'http://www.folkbibeln.se', image: 'partners/SFB.jpg'}],
                    :"pl"     => [{name: 'Biblica', url: 'http://www.biblica.com', image: 'partners/biblica.png'},
                                  {name: 'Fundacja Wrota Nadziei', url: 'http://www.wrotanadziei.org/', image: 'partners/FWN.jpg'}],
                    :"km"     => [{name: 'United Bible Societies', url: 'http://unitedbiblesocieties.org/', image: 'partners/en-ubs.jpg'}],
                    :"es"     => [{name: 'American Bible Society', url: 'http://www.americanbible.org/', image: 'partners/ABS.jpg'},
                                  {name: 'Bible League International', url: 'http://www.bibleleague.org', image: 'partners/bli.gif'},
                                  {name: 'Biblica', url: 'http://www.biblica.com', image: 'partners/biblica.png'},
                                  {name: 'The Lockman Foundation', url: 'http://www.nasbible.com', image: 'partners/lockman.jpg'},
                                  {name: 'Sociedades Bíblicas Unidas', url: 'http://sociedadbiblicasunidas.org/', image: 'partners/es-ubs.jpg'}],
                    :"de"     => [{name: 'Biblica', url: 'http://www.biblica.com', image: 'partners/biblica.png'},
                                  {name: 'Société Biblique de Genève', url: 'http://www.societebiblique.com', image: 'partners/SBG.jpg'}],
                    :"fa"     => [{name: 'Elam Ministries', url: 'http://www.kalameh.com/', image: 'partners/elam.png'}],
                    :"fr"     => [{name: 'Alliance biblique française – Bibli’O', url: 'http://www.la-bible.net.com', image: 'partners/ABF.jpg'},
                                  {name: 'Biblica', url: 'http://www.biblica.com', image: 'partners/biblica.png'},
                                  {name: 'Société Biblique de Genève', url: 'http://www.societebiblique.com', image: 'partners/SBG.jpg'},
                                  {name: 'Alliance Biblique Universelle', url: 'http://alliancebibliqueuniverselle.org', image: 'partners/fr-ubs.jpg'}],
                    :"af"     => [{name: 'Bible Society of South Africa', url: 'http://www.bybelgenootskap.co.za/voorblad-artikels/homepage', image: 'partners/BSSA.png'},
                                  {name: 'Christelike Uitgewersmaatskappy (CUM)', url: 'http://www.cumuitgewers.co.za', image: 'partners/CUM.jpg'}],
                    :"ko"     => [{name: '대한성서공회 / Korean Bible Society', url: 'http://www.bskorea.or.kr', image: 'partners/kbs.gif'},
                                  {name: 'Biblica', url: 'http://www.biblica.com', image: 'partners/biblica.png'}],
                    :"nl"     => [{name: 'Biblica', url: 'http://www.biblica.com', image: 'partners/biblica.png'}],
                    :"ja"     => [{name: 'Biblica', url: 'http://www.biblica.com', image: 'partners/biblica.png'}],
                    :"no"     => [{name: 'Biblica', url: 'http://www.biblica.com', image: 'partners/biblica.png'},
                                  {name: 'Norsk Bibel', url: 'http://www.norsk-bibel.no', image: 'partners/norskb.gif'}],
                    :"ro"     => [{name: 'Biblica', url: 'http://www.biblica.com', image: 'partners/biblica.png'}],
                    :"ru"     => [{name: 'Bible League International', url: 'http://www.bibleleague.org', image: 'partners/bli.gif'},
                                  {name: 'Biblica', url: 'http://www.biblica.com', image: 'partners/biblica.png'}],
                    :"zh-TW"  => [{name: 'Global Bible Initiative', url: 'http://www.globalbibleinitiative.org', image: 'partners/GBI.png'}],
                    :"zh-CN"  => [{name: 'Global Bible Initiative', url: 'http://www.globalbibleinitiative.org', image: 'partners/GBI.png'},
                                  {name: 'Biblica', url: 'http://www.biblica.com', image: 'partners/biblica.png'}]}
        partners[:"en-GB"] = partners[:en]
        partners
      end

      def to_s
        self.class.name.gsub('YV::Sites::', '')
      end

    end
  end
end
