# http://developers.youversion.com/api/docs/3/class_search__3__0___model.html

module Search
  class Bible < Base

    api_response_mapper YV::API::Mapper::BibleSearch
    attributes [:query,:opts,:human,:usfm,:version_id,:version_abbreviation,:content,:highlight]


    class << self

      def search_path
        "search/bible"
      end

    end

  end
end