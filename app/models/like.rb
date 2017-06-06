# TODO: 3.1
# - implement comments endpoints
# TODO - see after_build

class Like < YV::Resource

  attributes [:id, :user, :created_dt]
  api_response_mapper YV::API::Mapper::Base

  class << self

    def create(opts={})
      raise YV::AuthRequired unless opts[:auth]
      super(opts.slice(:auth, :moment_id))
    end

    # API Response after creating a Like.

    # {"next_page"=>nil,
    #  "likes"=>
    #   [{"user"=>
    #      {"username"=>"BrittTheNoob",
    #       "id"=>7476,
    #       "avatar"=>
    #        {"renditions"=>
    #          [{"url"=>
    #             "//d1c1qrnexsp66u.cloudfront.net/users/images/ac54139aadb4c63d85fec7eb64e4a6bd_24x24.png",
    #            "width"=>24,
    #            "height"=>24},
    #           {"url"=>
    #             "//d1c1qrnexsp66u.cloudfront.net/users/images/ac54139aadb4c63d85fec7eb64e4a6bd_48x48.png",
    #            "width"=>48,
    #            "height"=>48},
    #           {"url"=>
    #             "//d1c1qrnexsp66u.cloudfront.net/users/images/ac54139aadb4c63d85fec7eb64e4a6bd_128x128.png",
    #            "width"=>128,
    #            "height"=>128},
    #           {"url"=>
    #             "//d1c1qrnexsp66u.cloudfront.net/users/images/ac54139aadb4c63d85fec7eb64e4a6bd_512x512.png",
    #            "width"=>512,
    #            "height"=>512}],
    #         "action_url"=>"https://www.bible.com/users/7476",
    #         "style"=>"circle"},
    #       "name"=>"Brent TheLsh"},
    #     "created_dt"=>"2014-01-28T01:50:54.826920+00:00"}]}



    def delete(opts={})
      raise YV::AuthRequired unless opts[:auth]
      data,errs = post(delete_path,opts.slice(:auth, :moment_id, :user_id))
      map_delete(YV::API::Results.new(data,errs))
    end

    # API Response after deleting Like.

    # {"next_page"=>nil, "likes"=>nil}


  end

end