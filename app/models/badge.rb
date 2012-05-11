class Badge < YouVersion::Resource
  attr_i18n_reader :name
  attr_i18n_reader :description
  attribute :type
  attribute :image_url
  attribute :slug
  attribute :username

  def earned
    Date.parse(attributes["earned"])
  end

  def to_param
    self.slug
  end
  
  def image_url
    return @ssl_image_urls unless @ssl_image_urls.nil?
    
    #we only want to use secure urls
    sizes = ["24x24", "48x48", "128x128", "512x512"]
    hash ={}
    sizes.each do |size|
      hash["px_#{size}"] = attributes["image_url"]["px_#{size}_ssl"]
    end
    
    @ssl_image_urls = Hashie::Mash.new(hash)
  end
end
