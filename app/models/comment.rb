# TODO: 3.1
# - implement comments endpoints
# TODO - see after_build

class Comment < YV::Resource

  attributes [:id,:user,:content,:created_dt,:updated_dt]
  api_response_mapper YV::API::Mapper::Comment

  class << self

    # Comment.all(opts)
    # http://developers.youversion.com/api/docs/3.1/sections/comments/create.html
    # ------------------------------------------------------------------------------------------------------------
    # returns a 
    
    # options
    # * auth: required        {auth: auth_hash}
    # * moment_id: required   {moment_id: 12345}
    # * page: required        {page: 1}

    def all(opts={})
      raise YV::AuthRequired unless opts[:auth]
      opts[:page] ||= 1
      results = super(opts.slice(:moment_id, :auth, :page))
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
    # * content: required, the text content {content: "This be my comment."}


    # example API response

    # {"next_page"=>nil,
    #  "comments"=>
    #   [{"content"=>"I'm commenting on my bookmark!",
    #     "user"=>
    #      {"username"=>"BrittTheStager",
    #       "id"=>7440,
    #       "avatar"=>
    #        {"renditions"=>
    #          [{"url"=>
    #             "//d34xairzvf2fpg.cloudfront.net/users/images/7c5a1ca1111caa91093aa101783eaedd_24x24.png",
    #            "width"=>24,
    #            "height"=>24},
    #           {"url"=>
    #             "//d34xairzvf2fpg.cloudfront.net/users/images/7c5a1ca1111caa91093aa101783eaedd_48x48.png",
    #            "width"=>48,
    #            "height"=>48},
    #           {"url"=>
    #             "//d34xairzvf2fpg.cloudfront.net/users/images/7c5a1ca1111caa91093aa101783eaedd_128x128.png",
    #            "width"=>128,
    #            "height"=>128},
    #           {"url"=>
    #             "//d34xairzvf2fpg.cloudfront.net/users/images/7c5a1ca1111caa91093aa101783eaedd_512x512.png",
    #            "width"=>512,
    #            "height"=>512}],
    #         "action_url"=>"//www.bible.com/users/BrittTheStager",
    #         "style"=>"circle"},
    #       "name"=>"Britt Miles"},
    #     "id"=>1381163680698150}]}


    def create(opts={})
      raise YV::AuthRequired unless opts[:auth]
      super(opts.slice(:auth, :moment_id, :content))
    end


    def delete(id,opts={})
      raise YV::AuthRequired unless opts[:auth]
      data,errs = post( delete_path,opts.merge(id: id))
      map_delete(YV::API::Results.new(data,errs))
    end
  end

end