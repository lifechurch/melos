module SiteConfigs

  class Site
    def logo_style
      "background: url(yv_logo.png) no-repeat 0 14px; width: 150px"
    end

    def default_version; end
    
    def donate_path; end
    
    def versions; end
    
    def to_s
      self.class.name.gsub('SiteConfigs::', '')
    end

  end
end
