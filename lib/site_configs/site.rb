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
      {:en      => [{name: 'Publisher 1', url: 'http://www.publisherville.com', image: 'Biblica-540x320.png'}, 
                    {name: 'Publisher 2', url: 'http://www.publisherville.com', image: 'Biblica-540x320.png'}, 
                    {name: 'Publisher 3', url: 'http://www.publisherville.com', image: 'Biblica-540x320.png'}, 
                    {name: 'Publisher 4', url: 'http://www.publisherville.com', image: 'Biblica-540x320.png'}, 
                    {name: 'Publisher 5', url: 'http://www.publisherville.com', image: 'Biblica-540x320.png'}],
       :"pt-BR" => [{name: 'casa editora 1', url: 'http://www.publisherville.com', image: 'Biblica-540x320.png'}],
       :"zh-CN" => [{name: '鸣谢我们的合作伙伴 1', url: 'http://www.publisherville.com', image: 'Biblica-540x320.png'}]}
    end
    
    def to_s
      self.class.name.gsub('SiteConfigs::', '')
    end
    
  end
end
