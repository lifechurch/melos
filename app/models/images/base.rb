module Images
  class Base

    attr_accessor :url, :height, :width

    def initialize(data = {})
      atts = Hashie::Mash.new(data)
      self.url    = atts.url
      self.height = atts.height
      self.width  = atts.width
    end
  end
end