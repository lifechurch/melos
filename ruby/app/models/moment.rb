# Class for activities that have happened in the Bible app.
# This is the basis of our "Feed"
# http://developers.youversion.com/api/docs/3.1/sections/moments.html

class Moment < YV::Resource

  api_response_mapper YV::API::Mapper::Moment

  class << self


    # Moment.all(opts)
    # http://developers.youversion.com/api/docs/3.1/sections/moments/items.html
    # ------------------------------------------------------------------------------------------------------------
    # returns a YV::API::Results decorator for an array of paginated moments
    
    # options
    # * auth: required {auth: auth_hash}
    # * page: required, defaults to 1 {page: 2}
    # * kind: optional, string identifier {kind: "bookmark"|"highlight"|"note"}
    # * usfm: optional, "GEN.1"
    # * version_id: optional, required with usfm  123987
    # * user_id: optional, required with usfm/version {user_id: 12345}

    # example API data
    # TODO

    def all(opts={})
      super(opts.slice(:auth, :page, :kind, :user_id, :usfm, :version_id))
    end

    def client_side_items(opts={})
      opts.merge!({cache_for: YV::Caching.a_very_long_time})
      data, errs = get("moments/client_side_items",opts)
      map_client_side_items(YV::API::Results.new(data,errs))
    end

  end

end