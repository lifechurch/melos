module Images
  class AvatarCollection < Collection

    def self.init_from_api(response)
      object = new()
      object.collection = response.renditions.collect do |rendition_data|
        Images::Avatar.new(rendition_data)
      end
      object.action_url = response.action_url
      object.style  = response.style
      object
    end


    def sm_avatar
      select_item(24)
    end

    def md_avatar
      select_item(48)
    end

    def lg_avatar
      select_item(128)
    end

    def xl_avatar
      select_item(512)
    end
    
  end
end