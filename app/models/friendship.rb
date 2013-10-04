# New API introduced in 3.1 for social
# http://developers.youversion.com/api/docs/3.1/sections/friendships.html

class Friendship < YV::Resource

  attribute :auth
  attribute :user_id
  attribute :friend_ids
  attribute :outgoing_ids
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


    # Friendship.all(opts)
    # ------------------------------------------------------------------------------------------------------------
    # returns a Friendship instance with friend_ids, outgoing_ids and incoming_ids populated.
    
    # options
    # * auth: required {auth: auth_hash}

    # example API data
    # {"response"=>{"code"=>200, "data"=>{"friends"=>[], "outgoing"=>[], "incoming"=>[]}, "buildtime"=>"2013-09-19T20:23:06+00:00"}}






    # Friendship.offer(opts)
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
      return YV::API::Results.new(process_collection_response(data),errs)
    end





    # Friendship.incoming(opts)
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
      results = YV::API::Results.new(data,errs)
    end


    # Friendship.accept(opts)
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
      data, errs = post(decline_path, opts.slice(:auth,:user_id))
      return YV::API::Results.new(process_collection_response(data),errs)
    end


    # Friendship.decline(opts)
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
      return YV::API::Results.new(process_collection_response(data),errs)
    end





    private

    # Overridden method from Resource class to handle #all api calls
    def process_collection_response(data)
      new(outgoing_ids: data.outgoing, incoming_ids: data.incoming)
    end
  end

  private

  # After #create or #save, an instance of YV::API::Results is passed to this method
  # lets populate attributes on our instance
  def after_save(results)
    return unless data = results.data
    self.friend_ids = data.friends
    self.outgoing_ids = data.outgoing
    self.incoming_ids = data.incoming
  end

end