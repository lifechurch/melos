class Plan < YouVersion::Resource

  attribute :errors 
  attribute :publisher_url
  attribute :id
  attribute :slug
  attribute :version
  attr_i18n_reader :about
  attr_i18n_reader :name
  attr_i18n_reader :formatted_length
  attr_i18n_reader :copyright

  def self.categories(params = {})
    PlanCategories.all(params)
  end

  def self.all(opts = {})
    if opts[:query] 
      #query string was passed, search, since API doesn't give a query on library
      Plan.search(opts[:query], opts)
    else
    #TODO: this doesn't work if an integer id is passed?
      super(opts.merge(query: '*'))
    end
  end
  
  def self.list_path
    "#{api_path_prefix}/search"
  end
  
  def self.api_path_prefix
    "reading_plans"
  end
  
  def self.find(id, opts = {}, &block)
    case id
      when /^(\d+)[-](.+)/
        # format 1234-plan-slug
        id = id.match(/^(\d+)[-](.+)/)[1].to_i
      when String   
        #slug was passed, try to get id from slug with search, since API doesn't give a better way
        lib_plan = search(id).find{|plan| plan.slug.downcase == id.downcase}
        id = lib_plan.id unless lib_plan.nil?
    end
    
    opts[:query] ||= '*'
    
    #TODO: this doesn't work if an integer id is passed (?)
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
    params = {query: query, cache_for: 12.hours}.merge!(params.except("query", :query))

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
  
  def current_day
    1 #always show the first day if requested
  end
  
  def users(params = {})
    if !@users || (params[:page] != @users_page)
      params[:id] = id
      @users_page = params[:page] ||= 1
      
      response = YvApi.get("reading_plans/users", params) do |errors|
        if errors.length == 1 && [/^No(.*)found$/, /^(.*)s not found$/].detect { |r| r.match(errors.first["error"]) }
          return []
        else
          raise YouVersion::ResourceError.new(errors)
        end
      end
    
      @users = ResourceList.new
      @users.total = response.total
      response.users.each {|user| @users << Hashie::Mash.new({user: User.new(user.merge(:auth => params[:auth])), date: user.subscribed})}
    end
    @users
  end
  
  def title
    name
  end
  
  def length
    formatted_length
  end
  
  def total_days
    @total_days ||= @attributes.total_days.to_i
  end
  
  def days
    
    length
    
  end
  
  def to_param
    "#{id}-#{slug}"
  end
  
  def ==(compare)
    #if plan is compared to subscription or vice/versa
    correct_class = compare.class == Plan || compare.class == Subscription
    
    correct_class && self.id == compare.id
  end
  
  def self.subscribe (plan, user_auth)
    opts = {auth: user_auth}
    
    case plan
    when Fixnum, /\A[\d]+\z/
      opts[:id] = plan.to_i
    when Plan, Subscription
      opts[:id] = plan.id.to_i
    when String
      opts[:id] = Plan.find(plan).id
    end
    
    YouVersion::Resource.post('reading_plans/subscribe_user', opts)
    
    #EVENTUALLY: Do this right with Resource abstraction and on the subscription class(new) and user object(add_subscription) class
  end
  
  def subscribe (user_auth, opts = {})
    
    #/2.2/reading_plans/subscribe_user
    opts = opts.merge!(auth: user_auth)
    opts[:id] = id
    
    YouVersion::Resource.post('reading_plans/subscribe_user', opts)
    
  end
  
  def reading(day, opts = {})
    unless(@reading && @reading_day == day)
      opts[:day] ||= day
      opts[:id] ||= id
      opts[:cache_for] ||= 12.hours
      # we don't auth or send user_id because this is just a plan (not a subscription) that doesn't know about a user
      # to be overriden by Subscription model to send auth and user_id
      # we can cache the non-authed response

      response = YvApi.get("reading_plans/references", opts) do |errors|
        raise YouVersion::ResourceError.new(errors)
      end
      
      @reading = Hashie::Mash.new()
      @reading.devotional = YouVersion::Resource.i18nize(response.additional_content_html)
      @reading.devotional ||= "<p>" << YouVersion::Resource.i18nize(response.additional_content).gsub(/(\r\n\r\n)/, '</p><p>').gsub(/(\n\n)/, '</p><p>').gsub(/(\r\n)/, '<br>').gsub(/(\n)/, '<br>') << "</p>" if response.additional_content
      @reading.references = response.adjusted_days.first.references.map do |data| 
        osis_hash = data.reference.osis.to_osis_hash
        osis_hash[:version] = version
        Hashie::Mash.new(ref: Reference.new(osis_hash), completed?: (data.completed == "true"), no_version_ref: Reference.new(osis_hash.except(:version)))
      end
    end
    
    @reading
  end
end
