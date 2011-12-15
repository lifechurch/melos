class CategoryListing
  attr_reader :current, :breadcrumbs, :items

  def self.find(category_slug)
    #we only need 1st page to get all categories in the response
    #the params[:category] param will filter the query to only children of that category
    params = {page: 1, category: category_slug}

    response = YvApi.get("reading_plans/library", params) do |errors|
      raise ResourceError.new(errors)
    end
    
    CategoryListing.new(response.categories) 
  end
  
  def current_name
    @current ? @current.name : ""
  end

  def initialize(categories_json_mash)
    @json  = categories_json_mash
    @current = @json.current ? PlanCategory.new(@json.current) : nil
    @items = @json.children ? @json.children.map! {|child| PlanCategory.new(child)} : []
    @breadcrumbs = @json.breadcrumbs ? @json.breadcrumbs.map! {|category| PlanCategory.new(category)} : []
  end

end
