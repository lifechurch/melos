# TODO: 3.1
# http://developers.youversion.com/api/docs/3.1/sections/people.html
# Implement #items & #suggestions


class People < YV::Resource

  api_response_mapper YV::API::Mapper::People

  attribute :name
  attribute :user_name
  attribute :user_id

  class << self

    # People.suggestions(opts)
    # http://developers.youversion.com/api/docs/3.1/sections/people/suggestions.html
    # ------------------------------------------------------------------------------------------------------------
    # Returns: a YV::API::Results decorator for an array of People instances

    # retrieve friend (people) suggestions from API
    # options:
    # - auth: required {auth: auth_hash}

    # example API response
    # {"next_page"=>nil,
    #  "people"=>
    #   [{"username"=>"bdmtest14",
    #     "id"=>6752,
    #     "avatar"=>
    #      {"renditions"=>
    #        [{"url"=>
    #           "//d34xairzvf2fpg.cloudfront.net/users/images/54fb49451ee6a5924d58703f96c80b1d_24x24.png",
    #          "width"=>24,
    #          "height"=>24},
    #         {"url"=>
    #           "//d34xairzvf2fpg.cloudfront.net/users/images/54fb49451ee6a5924d58703f96c80b1d_48x48.png",
    #          "width"=>48,
    #          "height"=>48},
    #         {"url"=>
    #           "//d34xairzvf2fpg.cloudfront.net/users/images/54fb49451ee6a5924d58703f96c80b1d_128x128.png",
    #          "width"=>128,
    #          "height"=>128},
    #         {"url"=>
    #           "//d34xairzvf2fpg.cloudfront.net/users/images/54fb49451ee6a5924d58703f96c80b1d_512x512.png",
    #          "width"=>512,
    #          "height"=>512}]},
    #     "name"=>"bdmtest14"},
    #     { another_user }


    def suggestions_path
      "people/suggestions"
    end

    def suggestions(opts={})
      raise YV::AuthRequired unless opts[:auth]
      data, errs = get(suggestions_path, opts.slice(:auth))
      return map_suggestions(YV::API::Results.new(data,errs))
    end

    def map_suggestions(results)
      @api_response_mapper.map_suggestions(results)
    end


    # People.all(opts)
    # http://developers.youversion.com/api/docs/3.1/sections/people/items.html
    # Returns: TODO


    # Retrieve a list of people a user is connected to based on a source such as contacts, facebook, twitter.
    # options:
    # - auth: required {auth: auth_hash}
    # - source: required {source: facebook|twitter|contacts}

    def contacts_connections(opts={})
      raise YV::AuthRequired unless opts[:auth]
      opts.merge!(source: "contacts")
      return all(opts.slice(:auth, :source))
    end


    # TODO: Fix this up when 3.1 supports finding Twitter related users
    def twitter_connections(opts={})
      #opts.merge!(source: "twitter")
      #return all(opts.slice(:auth, :source))
      
      raise YV::AuthRequired unless opts[:auth]
      user = User.find(opts[:auth][:username], auth: opts[:auth])
      return [] unless user.connections["twitter"]
      return user.connections["twitter"].find_friends(page: 1)
    end

    # TODO: Fix this up when 3.1 supports finding Facebook related users
    def facebook_connections(opts={})
      #opts.merge!(source: "facebook")
      #return all(opts.slice(:auth, :source))

      raise YV::AuthRequired unless opts[:auth]
      user = User.find(opts[:auth][:username], auth: opts[:auth])
      return [] unless user.connections["facebook"]
      return user.connections["facebook"].find_friends(page: 1)
    end

  end

end