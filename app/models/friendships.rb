# New API introduced in 3.1 for social
# http://developers.youversion.com/api/docs/3.1/sections/friendships.html

class Friendships < YV::Resource

  api_response_mapper YV::API::Mapper::Friendships


  attribute :auth
  attribute :user_id
  attribute :friend_ids
  attribute :outgoing_ids
  attribute :incoming         # array of user objects
  attribute :incoming_ids


  class << self
    
    # override base /items path
    def list_path
      "#{api_path_prefix}/all_items"
    end

    def offer_path
      "#{api_path_prefix}/offer"
    end

    def accept_path
      "#{api_path_prefix}/accept"
    end

    def decline_path
      "#{api_path_prefix}/decline"
    end

    def delete_path
      "#{api_path_prefix}/delete"
    end

    def incoming_path
      "#{api_path_prefix}/incoming"
    end


    # Friendships.all(opts)
    # ------------------------------------------------------------------------------------------------------------
    # returns a Friendship instance with friend_ids, outgoing_ids and incoming_ids populated.
    
    # options
    # * auth: required {auth: auth_hash}

    # example API data
    # {"response"=>{"code"=>200, "data"=>{"friends"=>[], "outgoing"=>[], "incoming"=>[]}, "buildtime"=>"2013-09-19T20:23:06+00:00"}}






    # Friendships.offer(opts)
    # ------------------------------------------------------------------------------------------------------------
    # Offer a friendship with another user in YouVersion.
    # returns a YV::API::Results decorator for a Friendship instance with friend_ids, outgoing_ids and incoming_ids.
    
    # options:
    # * auth: required {auth: auth_hash}
    # * user_id: required, the id of the user being offered to. {user_id: 12345}

    # example API data
    # {"response"=>{"code"=>200, "data"=>{"friends"=>[], "outgoing"=>[], "incoming"=>[]}, "buildtime"=>"2013-09-19T20:23:06+00:00"}}

    def offer(opts={})
      raise YV::AuthRequired unless opts[:auth]
        data, errs = post(offer_path, opts.slice(:auth,:user_id))
        map_from_offer(YV::API::Results.new(data,errs))
    end

    def map_from_offer(results)
      @api_response_mapper.map_offer(results)
    end




    # Friendships.accept(opts)
    # ------------------------------------------------------------------------------------------------------------
    # accept a friendship request from a user
    # returns a YV::API::Results decorator for a Friendship instance with friend_ids, outgoing_ids and incoming_ids.
    
    # options
    # * auth: required  {auth: auth_hash}
    # * user_id: required, the id of the user who's requesting friendship {user_id: 12345}
    

    # example API data
    # {"response"=>{"code"=>201, "data"=>{"next_page"=>nil, "users"=>[]}, "buildtime"=>"2013-09-19T22:14:13+00:00"}}

    def accept(opts={})
      raise YV::AuthRequired unless opts[:auth]
        data, errs = post(accept_path, opts.slice(:auth,:user_id))
        map_from_accept(YV::API::Results.new(data,errs))
    end

    def map_from_accept(results)
      @api_response_mapper.map_accept(results)
    end



    # Friendships.decline(opts)
    # ------------------------------------------------------------------------------------------------------------
    # decline a friendship request from a user
    # returns a YV::API::Results decorator for a Friendship instance with friend_ids, outgoing_ids and incoming_ids.
    
    # options
    # * auth: required  {auth: auth_hash}
    # * user_id: required, the id of the user who's requesting friendship {user_id: 12345}
    

    # example API data
    # {"response"=>{"code"=>201, "data"=>{"next_page"=>nil, "users"=>[]}, "buildtime"=>"2013-09-19T22:14:13+00:00"}}

    def decline(opts={})
      raise YV::AuthRequired unless opts[:auth]
        data, errs = post(decline_path, opts.slice(:auth,:user_id))
        map_from_decline(YV::API::Results.new(data,errs))
    end

    def map_from_decline(results)
      @api_response_mapper.map_decline(results)
    end



    # Friendships.incoming(opts)
    # ------------------------------------------------------------------------------------------------------------
    # get incoming friendship requests
    # returns YV::API::Results with contents of "data" key from API response
    
    # options:
    # * auth: required                  {auth: auth_hash}
    # * page: optional, defaults to 1   {page: 2, auth: some_auth}

    # example API data
    # {"response"=>{"code"=>200, "data"=>{"next_page"=>nil, "users"=>[]}, "buildtime"=>"2013-09-19T22:14:13+00:00"}}

    # TODO: map out data object

    def incoming(opts={})
      raise YV::AuthRequired unless opts[:auth]
        opts = {page: opts[:page] || 1}.merge!(opts.slice(:auth))
        data, errs = get(incoming_path, opts)
        map_from_incoming(YV::API::Results.new(data,errs))
    end

    def map_from_incoming(results)
      @api_response_mapper.map_incoming(results)
    end


  end

end