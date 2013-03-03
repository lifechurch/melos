module Videos
  class Rendition < YouVersion::Resource

    attribute :url
    attribute :format
    attribute :protocol
    attribute :multi_bitrate

    def after_build
      build_variants(self.attributes.variants)
    end

    def variants
      @variants
    end

    protected

    def build_variants( variants_array )
      return @variants = nil if variants_array.blank?
      @variants = ResourceList.new do |list|
        list.total = variants_array.count
        variants_array.each do |var|
          list << Videos::Variant.new(var)
        end
      end
    end

  end
end