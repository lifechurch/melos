class CategoryListing
  attr_reader :current, :breadcrumbs, :items

  def self.find(category_slug, opts={})
    #we only need 1st page to get all categories in the response
    #the params[:category] param will filter the query to only children of that category
    opts[:page] ||= 1
    opts[:category] ||= category_slug
    opts[:cache_for] ||= 1.hour
    opts[:query] = '*'

    response = YvApi.get("reading_plans/search", opts) do |errors|
      if errors.length == 1 && [/^No(.*)found$/, /^(.*)s not found$/].detect { |r| r.match(errors.first["error"]) }
        raise "No Plans in this category!"
      else
        raise YouVersion::ResourceError.new(errors)
      end
    end

    CategoryListing.new(response.categories)
  end

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

end
