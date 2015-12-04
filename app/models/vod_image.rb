class VOD_Image
  attr_accessor :verse_url,:human_reference,:image_urls,:day,:usfm,:version,:image_sizes,:image_url

  def initialize(data, size)
    self.verse_url = data['verse_url']
    self.human_reference = data['human_reference']
    self.image_urls = data['image_urls']
    self.day = data['day']
    self.usfm = data['usfm']
    self.version = data['version']

    self.image_sizes = {}
    self.image_urls.each do |img|
      self.image_sizes[img['height']] = img
    end

    self.image_url = self.image_sizes[size]['url']
  end

end
