# Relevant API response example.
# http://developers.youversion.com/api/docs/3.1/sections/notifications/items.html#example-response

module Notifications

  class Image
    attr_accessor :url, :height, :width, :action_url

    def initialize(data = {})
      @attributes = Hashie::Mash.new(data)
      self.url    = @attributes.url
      self.height = @attributes.height
      self.width  = @attributes.width
      self.action_url = @attributes.action_url
    end
  end

  class Avatar < Image
  end

  class Icon < Image
  end
end