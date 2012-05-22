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
    
    def to_s
      self.class.name.gsub('SiteConfigs::', '')
    end

  end
end
