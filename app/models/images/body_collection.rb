module Images
  class BodyCollection < Collection

    def self.init_from_api(response)
      object = new()
      object.collection = response.renditions.collect do |rendition_data|
        Images::Body.new(rendition_data)
      end
      object.action_url = response.action_url
      object
    end


    def md
      select_item(400)
    end

    def lg
      select_item(800)
    end

    
  end
end