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
  
  def self.all(opts = {})
    if opts[:query] 
      #slug was passed, get id from slug with search, since API doesn't give a better way
      Plan.search(opts[:query], opts)
    else
    #TODO: this doesn't work if an integer id is passed?
      super
    end
  end
  
  def self.list_path
    "#{api_path_prefix}/library"
  end
  
  def self.api_path_prefix
    "reading_plans"
  end
  
  def self.find(id, opts = {}, &block)
    if id.is_a?(String) 
      #slug was passed, get id from slug with search, since API doesn't give a better way
      lib_plan = search(id).find{|plan| plan.slug == id}
      id = lib_plan.id unless lib_plan.nil
    end

    #TODO: this doesn't work if an integer id is passed?
    super(id, opts, &block)
    
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
    query = '*' if (query == "" || query == nil)
    params = {query: query}.merge!(params)
    
    response = YvApi.get("#{api_path_prefix}/search", params) do |errors|
      if errors.length == 1 && [/^No(.*)found$/, /^(.*)s not found$/].detect { |r| r.match(errors.first["error"]) }
        return []
      else
        raise YouVersion::ResourceError.new(errors)
      end
    end
    
    list = ResourceList.new
    list.total = response.total
    response.reading_plans.each {|data| list << Plan.new(data.merge(:auth => params[:auth]))}
    list
    
  end
  
  def users(params = {})
    params[:page] ||= 1
    params[:id] = id

    response = YvApi.get("reading_plans/users", params) do |errors|
      if errors.length == 1 && [/^No(.*)found$/, /^(.*)s not found$/].detect { |r| r.match(errors.first["error"]) }
        return []
      else
        raise ResourceError.new(errors)
      end
    end
    
    users = ResourceList.new
    users.total = response.total
    response.users.each {|user| users << User.new(user.merge(:auth => params[:auth]))}
    users
  end
  
  def title
    name
  end
  
  def length
    formatted_length
  end
  
  def to_param
    slug
  end
  
  def ==(compare)
    #if plan is compared to subscription or vice/versa
    correct_class = compare.class == Plan || compare.class == Subscription
    
    correct_class && self.id == compare.id
  end
  
  def subscribe (user_auth, opts = {})
    
    #/2.2/reading_plans/subscribe_user
    opts = opts.merge!(auth: user_auth)
    opts[:id] = id
    
    YouVersion::Resource.post('reading_plans/subscribe_user', opts)
    
  end
end