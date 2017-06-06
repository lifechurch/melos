module Images
  class Collection

    attr_accessor :collection, :action_url, :style

    def select_optimized_width(size)
      collection.select {|image| image.width >= size}.first
    end


    private

    def select_item(size)
      collection.select {|image| image.width == size }.first
    end

  end
end