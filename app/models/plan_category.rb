class PlanCategory < YV::Resource
  
  api_response_mapper YV::API::Mapper::PlanCategory

  attribute :slug
  attribute :label #TODO localize
  attribute :parent
  attribute :children
  attribute :breadcrumbs

  class << self

    def resource_path
      "search/reading_plans"
    end

    def find(category_slug=nil, opts={})
      #we only need 1st page to get all categories in the response
      #the params[:category] param will filter the query to only children of that category
      opts[:page]       = 1
      opts[:category]   = category_slug
      opts[:cache_for]  = YV::Caching.a_long_time
      opts[:query]      = '*'
      super(nil,opts)
    end

  end # class methods ----------------------------------------------------------------------------------------------

  def count
    children.nil? ? 0 : children.count
  end

  def length
    count
  end

end
