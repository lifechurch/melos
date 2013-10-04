# TODO: 3.1
# - implement comments endpoints


class Comment < YV::Resource

  class << self

    # Comment.all(opts)
    # http://developers.youversion.com/api/docs/3.1/sections/comments/items.html
    # ------------------------------------------------------------------------------------------------------------
    # returns a 
    
    # options
    # * auth: required        {auth: auth_hash}
    # * moment_id: required   {moment_id: 12345}
    # * page: required        {page: 1}

    def all(opts={})
      raise YV::AuthRequired unless opts[:auth]
      opts[:page] ||= 1
      results = super(opts)
      if results.invalid?
         # return an empty array if API returns 'not found'
         results.data = [] if results.has_error?("not found") or results.has_error?("not_found")
      end
      return results
    end

    # Comment.create(opts)
    # http://developers.youversion.com/api/docs/3.1/sections/comments/items.html
    # ------------------------------------------------------------------------------------------------------------
    # returns a 
    
    # options
    # * auth: required                      {auth: auth_hash}
    # * moment_id: required                 {moment_id: 12345}
    # * content: required, the text content {page: 1}



  end

end