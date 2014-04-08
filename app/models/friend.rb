# New API introduced in 3.1 for Social
# http://developers.youversion.com/api/docs/3.1/sections/friends.html

class Friend < YV::Resource

  api_response_mapper YV::API::Mapper::Friend

  class << self

    def delete_path
      "#{api_path_prefix}/delete"
    end

    # Friendship.all(opts)
    # http://developers.youversion.com/api/docs/3.1/sections/friends/items.html
    # ------------------------------------------------------------------------------------------------------------
    # returns a YV::API::Results decorator for an array of paginated user objects
    
    # options
    # * auth: required {auth: auth_hash}
    # * page: required, defaults to 1 {page: 2}
    # * user_id: required

    # example API data
    # {"response": 
    #   {"code": 200,
    #     "data":
    #       {"users": [{user object},{user object}],
    #        "next_page": null},
    #    "buildtime": "2013-06-21T19:07:42+00:00"}}

    def all(opts={})
      raise YV::AuthRequired unless opts[:auth]
      opts.merge!(page: opts[:page] || 1) # page required, defaults to 1
      super(opts.slice(:auth,:user_id,:page))
    end


    # Friendship.ids(opts)
    # http://developers.youversion.com/api/docs/3.1/sections/friends/all_items.html
    # ------------------------------------------------------------------------------------------------------------
    # returns a YV::API::Results decorator for an array of user ids
    # [1,2,3,4,5,777]
    
    # options
    # * auth: required {auth: auth_hash}

    # example API data
    # {"response": 
    #   {"code": 200,
    #     "data":
    #       {"friends": [242,251,2394290342] ...

    def ids_path
      "#{api_path_prefix}/all_items"
    end


    def ids(opts={})
      raise YV::AuthRequired unless opts[:auth]
        data, errs = get(ids_path, opts.slice(:auth))
        result_data = (errs.blank?) ? data.friends : data
        return YV::API::Results.new(result_data,errs)
    end

    def with?( user_or_id, opts={} )
      id = user_or_id.is_a?(User) ? user_or_id.id : user_or_id
      return ids(opts).include? id.to_i
    end



    # Friendship.delete(opts)
    # http://developers.youversion.com/api/docs/3.1/sections/friends/delete.html
    # ------------------------------------------------------------------------------------------------------------
    # returns a YV::API::Results decorator for an array of user ids
    
    # options
    # * auth: required {auth: auth_hash}
    # * user_id: required {user_id: 12345}

    # example API data
    # {"response": 
    #   {"code": 200,
    #     "data":
    #       {"friends": [] ...

    def delete(opts={})
      raise YV::AuthRequired unless opts[:auth]
        data, errs = post(delete_path,opts.slice(:auth,:user_id))
        result_data = (errs.blank?) ? data.friends : data
        return YV::API::Results.new(result_data,errs)
    end

  end
end

