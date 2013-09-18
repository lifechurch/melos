class CategoryListing < YV::Resource
  
  attr_reader :current, :breadcrumbs, :items

  class << self

    def find(category_slug=nil, opts={})
      #we only need 1st page to get all categories in the response
      #the params[:category] param will filter the query to only children of that category
      opts[:page]       ||= 1
      opts[:category]   ||= category_slug
      opts[:cache_for]  ||= YV::Caching.a_long_time
      opts[:query]        = '*'

      # Example API response data
      # 

       # {"categories"=>
       #   {"parent"=>nil,
       #    "current"=>nil,
       #    "children"=>
       #     [{"category"=>"new_plans",
       #       "labels"=>
       #        {"default"=>"New",
       #         "en"=>"New"}},
       #      {"category"=>"featured_plans",
       #       "labels"=> ...


      data, errs = get("search/reading_plans", opts)
      return CategoryListing.new(data.categories) if errs.blank?
      # TODO: Track error, raise error, ??
    end
  end
  # END class methods ----------------------------------------------------------------------------------------------



  def current_name
    @current ? @current.name : nil
  end

  def current_slug
    @current ? @current.slug : nil
  end

  def initialize(categories_json_mash)
    @json  = categories_json_mash
    @current = @json.current ? PlanCategory.new(@json.current) : nil
    @items = @json.children ? @json.children.map! {|child| PlanCategory.new(child)} : []
    @breadcrumbs = @json.breadcrumbs ? @json.breadcrumbs.map! {|category| PlanCategory.new(category)} : []
  end

  def count
    items.count
  end

  def length
    count
  end

end
