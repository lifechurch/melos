class Plan < YouVersion::Resource

  attribute :errors 
  attribute :publisher_url
  attribute :id
  attribute :slug
  attr_i18n_reader :about
  attr_i18n_reader :name
  attr_i18n_reader :formatted_length
  attr_i18n_reader :copyright

  def self.categories(params = {})
    PlanCategories.all(params)
  end
  
  def self.list_path
    "#{api_path_prefix}/library"
  end
  
  def self.api_path_prefix
    "reading_plans"
  end
  
  def self.find(id, params = {}, &block)
    

    if id.is_a?(String) 
      #slug was passed, get id from slug with search, since API doesn't give a better way
      lib_plan = search(id).find{|plan| plan.slug == id}
      id = lib_plan.id
    end

    super(id, params, &block)
    
  end
  def self.search(query, params = {})
    
    # Get search results for a query.
    # 
    #     URL: /2.3/reading_plans/search.json?query=parenting
    #     Method: GET
    # 
    #     Parameters:
    #     query of what you're wanting to search for
    #     category  to filter reading plans to (optional)
    #     total_days  will accept one of the predefined ranges to limit results to '1_day_to_7_days', '1_week_to_1_month', '1_month_to_3_months', '3_months_to_6_months', '6_months_to_1_year', '1_year_to_infinity', it's optional
    #     language_tag  to filter reading plans to (optional, but highly recommended for best search results)
    #     sort  the ordering of the results, defaults to 'score' (relevance), also accepts 'total_days'
    #     page  number of results to return
    
    params = {query: query}.merge!(params)
    
    response = YvApi.get("#{api_path_prefix}/search", params) do |errors|
      raise ResourceError.new(errors)
    end
    response.reading_plans.map {|data| new(data.merge(:auth => params[:auth]))}
    
  end
  
  def title
    name
  end
  
  def to_param
    slug
  end
  
end