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
    # * user_id: optional, {user_id: 12345}

    # example API data
    # TODO

    def all(opts={})
      super(opts.slice(:auth, :user_id, :page, :kind))
    end

  end

end