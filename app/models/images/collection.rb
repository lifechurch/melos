module Images
  class Collection

    attr_accessor :collection, :action_url, :style


    private

    def select_item(size)
      collection.select {|item| item.width == size }.first
    end

  end
end