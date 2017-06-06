module Images
  class IconCollection < Collection

    def self.init_from_api(response)
      object = new()
      object.collection = response.renditions.collect do |rendition_data|
        Images::Icon.new(rendition_data)
      end
      object.action_url = response.action_url
      object
    end

    def sm_icon
      select_item(24)
    end

    def md_icon
      select_item(36)
    end

    def lg_icon
      select_item(48)
    end

    def xl_icon
      select_item(72)
    end

  end
end