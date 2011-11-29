class Plan < YouVersion::Resource

  attribute :errors 
  attribute :publisher_url
  attribute :id
  attribute :slug
  attribute :foo
  attribute :about
  attribute :name
  attribute :formatted_length
  attribute :copyright
  
  #attr_i18n_reader :name, :copyright

  # @@all = {}
  # 
  #   def self.all(opts = {})
  #     opts = {page: 1}.merge!(opts)
  #     YvApi.get("reading_plans/library", page: opts[:page], category: opts[:category], language_tag: opts[:language]).reading_plans.map { |r| ReadingPlan.new(r.to_hash) }
  #   end

  def self.api_path_prefix
    #name.tableize
    "reading_plans"
  end

  def self.categories(params = {})
    params = {page: 1}.merge!(params)
    response = YvApi.get(list_path, params) do |errors|
      raise ResourceError.new(errors)
    end
    
    response.categories.children.map! {|c| c.label}
    
  end
  
  def self.list_path
    "#{api_path_prefix}/library"
  end
  
  def to_param
    slug
  end
  
  # def self.all(params = {})
  #   params = {page: 1}.merge!(params)
  #   response = YvApi.get(list_path, params) do |errors|
  #     raise ResourceError.new(errors)
  #   end
  #   response.reading_plans
  #   debugger
  #   # puts "*"*80
  #   # pp response
  #   # puts "*"*80
  #   # TODO: Switch to ResourceList here
  #   response.send(api_path_prefix).map {|data| new(data.merge(:auth => params[:auth]))}
  # end

end
