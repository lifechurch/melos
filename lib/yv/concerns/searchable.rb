module YV
  module Concerns
    module Searchable

      def self.included(base)
        base.extend(ClassMethods)
      end

      module ClassMethods
        
        def search_path
          raise "Must specify a search path in your model: 'search/users' for example"
        end

        def search(query="*", opts={})
          data,errs = get(search_path, opts.merge(query: query))
          data = [] if not_found?(errs)
          map_search(YV::API::Results.new(data,errs))
        end

        def map_search(results)
          raise "Declare an API Response Mapper" unless @api_response_mapper.present?
          results.data = @api_response_mapper.map_search(results.data)
          results
        end

      end

    end
  end
end