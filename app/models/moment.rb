# Class for activities that have happened in the Bible app.
# This is the basis of our "Feed"
# http://developers.youversion.com/api/docs/3.1/sections/moments.html

class Moment < YV::Resource

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
      raise YV::AuthRequired unless opts[:auth]
      data, errs = get(list_path, opts.slice(:auth, :user_id, :page, :kind))
      results = YV::API::Results.new(data,errs)

      # Catch not found and return empty array.
      if results.invalid?
         data = [] if results.has_error?("not found") or results.has_error?("not_found")
      end
      return YV::API::Results.new(data,errs)
    end

  end

end