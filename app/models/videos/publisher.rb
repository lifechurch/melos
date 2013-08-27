module Videos
  class Publisher < YV::Resource
    attribute :id
    attribute :name
    attribute :description
    attribute :links
    attribute :video_id
    attribute :ga_tracking_id

    def images
      @images
    end

    def website
      links.first
    end

    def ad_image
      image(360)
    end

    def image( size )
      images.select {|th| th.width == size }.first
    end

    def after_build
      @images = build_images(self.attributes.images)
    end

    protected

    def build_images( images_array )
      return nil if images_array.blank?
      images = ResourceList.new do |list|
        list.total = images_array.count
        images_array.each do |img|
          list << Videos::Image.new(img)
        end
      end
    end

  end
end