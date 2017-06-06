module Search
  class Base < YV::Resource
  
    include YV::Concerns::Searchable
  
    def initialize(query="*",opts={})
      super({query: query, opts: opts})
    end

    def results
      @results ||= self.class.search(query,opts)
    end

  end
end