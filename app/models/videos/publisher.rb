module Videos
  class Publisher < YouVersion::Resource
    attribute :id
    attribute :name
    attribute :description
    attribute :links
    attribute :video_id
  end

  def images
    @images
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