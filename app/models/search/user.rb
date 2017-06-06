# http://developers.youversion.com/api/docs/3/class_search__3__0___model.html

module Search
  class User < Base

    api_response_mapper YV::API::Mapper::UserSearch
    attributes [:query,:opts,:id,:username,:name,:avatars]  

    class << self

      def search_path
        "search/users"
      end

    end

  end
end