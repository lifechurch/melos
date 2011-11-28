class Plan < YouVersion::Resource

  attr_reader :errors 
  attr_reader :publisher_url
  attr_reader :id
  attr_reader :slug
  attr_reader :foo
  attr_reader :about
  
  #attr_i18n_reader :name, :copyright

  # @@all = {}
  # 
  #   def self.all(opts = {})
  #     opts = {page: 1}.merge!(opts)
  #     YvApi.get("reading_plans/library", page: opts[:page], category: opts[:category], language_tag: opts[:language]).reading_plans.map { |r| ReadingPlan.new(r.to_hash) }
  #   end

  def api_path_prefix
    #name.tableize
    "reading_plans"
  end

  def self.categories(opts = {})
    opts = {page: 1}.merge!(opts)
    YvApi.get("reading_plans/library", page: opts[:page], category: opts[:category], language_tag: opts[:language]).categories
  end

  def to_param
    @slug
  end

end
