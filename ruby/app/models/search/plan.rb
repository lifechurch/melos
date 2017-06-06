# http://developers.youversion.com/api/docs/3/class_search__3__0___model.html

module Search
  class Plan < Base

    api_response_mapper YV::API::Mapper::PlanSearch
    attributes [:query,:opts,:id,:username,:name,:avatars]  

    class << self

      def search_path
        "search/reading_plans"
      end

    end

  end
end