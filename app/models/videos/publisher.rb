module Videos
  class Publisher
    
    attr_accessor :id,
                  :name,
                  :description,
                  :links,
                  :video_id,
                  :ga_tracking_id,
                  :images


    def website
      links.first
    end

    def ad_image
      image(360)
    end

    def image( size )
      images.select {|th| th.width == size }.first
    end

  end
end