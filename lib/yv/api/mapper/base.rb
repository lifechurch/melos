module YV
  module API
    module Mapper
      class Base

        include FastGettext::Translation
        
        class << self
          
          def map(results, instance, action)
            send("from_#{action}".to_sym, instance, results)
          end

          def map_all(results)
            from_all(results)
          end

          def map_delete(results)
            from_delete(results)
          end

          def map_search(results)
            from_search(results)
          end

          def map_client_side_items(results)
            from_client_side_items(results)
          end

          private

            def from_all(results)
              return results
            end

            def from_search(results)
              return results
            end

            def from_delete(results)
              return results
            end

            def from_create(instance, results)
              return results
            end

            def from_update(instance, results)
              return results
            end

            def from_find(instance, results)
              return results
            end

            def from_default(instance,results)
              return results
            end

            def map_to_instance(instance,results)
              return results
            end

            # Map data to comments array
            def map_to_comments(comments_data)
              unless comments_data.nil?
                comments_data.collect do |comment_data|
                  YV::API::Mapper::Comment.map_to_instance(::Comment.new, comment_data)
                end
              end
            end

            def map_to_avatars(data)
              return Images::AvatarCollection.init_from_api(data) unless data.nil?
            end

            def map_to_icons(data)
              return Images::IconCollection.init_from_api(data) unless data.nil?
            end

            def map_to_body_images(data)
              return Images::BodyCollection.init_from_api(data) unless data.nil?
            end


            def map_to_user_fields(instance,user_data)
              instance.user_id = user_data.id
              instance.user_name = user_data.username
              instance
            end

            # Map data to user instance
            def map_to_user(user_instance, user_data)
              user_instance.id          = user_data.id
              user_instance.name        = user_data.name
              user_instance.username    = user_data.username
              user_instance.first_name  = user_data.first_name
              user_instance.last_name   = user_data.last_name
              user_instance.avatars     = map_to_avatars(user_data.avatar)
              user_instance
            end


            def map_to_like_fields(instance,like_data)
              instance.likes            = map_to_likes(like_data.likes)
              instance.liking           = like_data.enabled
              instance.likes_user_ids   = like_data.all_users
              instance.likes_count      = like_data.total
              instance
            end

            # Likes are just an array of users
            def map_to_likes(likes_data)
              unless likes_data.nil?
                likes_data.collect do |like_data|
                  map_to_like(::Like.new,like_data)
                end
              end
            end

            def map_to_like(like_instance,like_data)
              like_instance.created_dt = like_data.created_dt
              like_instance.user = map_to_user(::User.new, like_data.user)
              like_instance
            end

            def t( identifier , api_args )
              str = _(identifier).dup
              api_args.each do |key,val|
                str.sub!("\{#{key}\}",val || "")
              end unless api_args.nil? || str.nil?
              return str
            end

        end
      end
    end
  end
end