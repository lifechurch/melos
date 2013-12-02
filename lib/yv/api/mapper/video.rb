module YV
  module API
    module Mapper
      class Video < Base

        class << self
          def from_find(instance,results)
            map_to_instance(instance,results)
          end

          def map_to_instance(instance,data)
            instance.id = data.id
            instance.title = data.title
            instance.description = data.description
            instance.runtime = data.runtime
            instance.references = data.references
            instance.type = data.type
            instance.short_url = data.short_url
            instance.license_required = data.license_required

            instance.created_dt = data.created_dt
            instance.published_dt = data.published_dt
            instance.language_tag = data.language_tag

            # Associations / related objects
            instance.publisher  = build_publisher(data.publisher)
            instance.thumbnails = build_thumbnails(data.thumbnails)
            instance.renditions = build_renditions(data.renditions)
            instance.videos     = build_subvideos(data.sub_videos)

            YV::API::Results.new(instance)
          end

          def build_publisher(data)
            pub = Videos::Publisher.new
            pub.id = data.id
            pub.name = data.name
            pub.description = data.description
            pub.links = data.links
            pub.ga_tracking_id = data.ga_tracking_id
            pub.video_id = data.video_id

            pub.images = if data.images.present?
              ResourceList.new do |list|
                list.total = data.images.count
                data.images.each do |img|
                  list << Videos::Image.new(img)
                end
              end
            else
              []
            end

            return pub
          end


          def build_thumbnails( thumbnail_array )
            return [] if thumbnail_array.blank?

            return ResourceList.new do |list|
              list.total = thumbnail_array.count
              thumbnail_array.each do |img|
                list << Videos::Image.new(img)
              end
            end
          end


          def build_renditions( renditions_array )
            return [] if renditions_array.blank?
            renditions = ResourceList.new do |list|
              list.total = renditions_array.count
              renditions_array.each do |ren|
                list << Videos::Rendition.new(ren)
              end
            end
            return renditions
          end


          # Populate child videos
          def build_subvideos( videos_array )
            return nil if videos_array.blank?
            videos = ResourceList.new do |list|
              list.total = videos_array.count
              videos_array.each do |vid|
                list << ::Video.new(vid)
              end
            end
            return videos
          end
        end

      end
    end
  end
end
