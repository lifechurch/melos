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

          private

            def from_all(results)
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
                  map_to_comment(::Comment.new,comment_data)
                end
              end
            end

            def map_to_avatars(data)
              return Images::AvatarCollection.init_from_api(data) unless data.nil?
            end

            def map_to_icons(data)
              return Images::IconCollection.init_from_api(data) unless data.nil?
            end

            # Map data to comment instance
            def map_to_comment(comment_instance, comment_data)
              comment_instance.content = comment_data.content
              comment_instance.user    = map_to_user(::User.new,comment_data.user)
              comment_instance
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

            def t( identifier , api_args )
              str = _(identifier).dup
              api_args.each do |key,val|
                str.sub!("\{#{key}\}",val)
              end
              return str
            end

        end
      end
    end
  end
end