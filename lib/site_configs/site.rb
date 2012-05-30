# encoding: UTF-8
module SiteConfigs
  
  class Site
    def logo_style
      "background: no-repeat 0 14px; width: 150px"
    end
    
    def logo_image
      'yv_logo.png'
    end
    
    def default_version; end
    
    def donate_path; end
    
    def versions; end
    
    def partners #this static content will eventually come from the API, putting it here for now as white-labels could have issue
      
      {:en      => [{name: 'American Bible Society', url: 'http://www.americanbible.org/', image: 'ABS.jpg'},
                    {name: 'Biblica', url: 'http://www.biblica.com', image: 'biblica.png'},
                    {name: 'Crossway', url: 'http://www.esv.org', image: 'crossway.jpeg'},
                    {name: 'God’s Word Translation', url: 'http://www.godswordtranslation.org', image: 'gwt.jpg'},
                    {name: 'Holman Bible Publishers', url: 'http://www.HCSB.org', image: 'hcsb.jpg'},
                    {name: 'The Lockman Foundation', url: 'http://www.nasbible.com', image: 'lockman.jpg'},
                    {name: 'Logos Bible Software', url: 'http://www.logos.com/?utm_source=youversion.com&utm_medium=aboutpage&utm_content=buttonlink&utm_campaign=youversion', image: 'LOGOS.png'},
                    {name: 'NET Bible', url: 'http://bible.org/', image: 'netbible.jpg'},
                    {name: 'Zondervan', url: 'http://zondervan.com/bibles', image: 'zondervan.jpg'}],
      :"pt-BR"  => [{name: 'Biblica', url: 'http://www.biblica.com', image: 'biblica.png'},
                    {name: 'Sociedade Bíblica do Brasil', url: 'http://www.sbb.org.br', image: 'sbb.png'}],
      :"sv"     => [{name: 'Biblica', url: 'http://www.biblica.com', image: 'biblica.png'},
                    {name: 'Svenska Folkbibeln', url: 'http://www.folkbibeln.se', image: 'SFB.jpg'}],
      :"po"     => [{name: 'Biblica', url: 'http://www.biblica.com', image: 'biblica.png'},
                    {name: 'Fundacja Wrota Nadziei', url: 'http://www.wrotanadziei.org/', image: 'FWN.jpg'}],
      :"km"     => [{name: 'United Bible Societies', url: 'http://www.unitedbiblesocieties.org/', image: 'UBS.gif'}],
      :"es"     => [{name: 'American Bible Society', url: 'http://www.americanbible.org/', image: 'ABS.jpg'},
                    {name: 'Biblica', url: 'http://www.biblica.com', image: 'biblica.png'},
                    {name: 'The Lockman Foundation', url: 'http://www.nasbible.com', image: 'lockman.jpg'},
                    {name: 'United Bible Societies', url: 'http://www.unitedbiblesocieties.org/', image: 'UBS.gif'}],
      :"de"     => [{name: 'Biblica', url: 'http://www.biblica.com', image: 'biblica.png'},
                    {name: 'Société Biblique de Genève', url: 'http://www.societebiblique.com', image: 'SBG.jpg'}],
      :"fr"     => [{name: 'Biblica', url: 'http://www.biblica.com', image: 'biblica.png'},
                    {name: 'Société Biblique de Genève', url: 'http://www.societebiblique.com', image: 'SBG.jpg'}],
      :"af"     => [{name: 'Bible Society of South Africa', url: 'http://www.bybelgenootskap.co.za/voorblad-artikels/homepage', image: 'BSSA.png'},
                    {name: 'Christelike Uitgewersmaatskappy (CUM)', url: 'http://www.cumuitgewers.co.za', image: 'CUM.jpg'}],
      :"ko"     => [{name: 'Biblica', url: 'http://www.biblica.com', image: 'biblica.png'}],
      :"nl"     => [{name: 'Biblica', url: 'http://www.biblica.com', image: 'biblica.png'}],
      :"ja"     => [{name: 'Biblica', url: 'http://www.biblica.com', image: 'biblica.png'}],
      :"no"     => [{name: 'Biblica', url: 'http://www.biblica.com', image: 'biblica.png'}],
      :"ru"     => [{name: 'Biblica', url: 'http://www.biblica.com', image: 'biblica.png'}],
      :"zh-TW"  => [{name: 'Asia Bible Society', url: 'http://www.asiabiblesociety.org', image: 'asiabiblesociety.png'}],
      :"zh-CN"  => [{name: 'Asia Bible Society', url: 'http://www.asiabiblesociety.org', image: 'asiabiblesociety.png'},
                    {name: 'Biblica', url: 'http://www.biblica.com', image: 'biblica.png'}]}
    end
    
    def to_s
      self.class.name.gsub('SiteConfigs::', '')
    end
  
  end
end
