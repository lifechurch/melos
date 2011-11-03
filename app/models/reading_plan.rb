class ReadingPlan < YvModel

  attr_reader :errors, :publisher_url, :id, :slug, :foo
  attr_i18n_reader :name, :copyright, :about

  @@all = {}

  def self.all(opts = {})
    opts = {page: 1}.merge!(opts)
    YvApi.get("reading_plans/library", page: opts[:page], category: opts[:category], language_tag: opts[:language]).reading_plans.map { |r| ReadingPlan.new(r.to_hash) }
  end

  def self.categories(opts = {})
    opts = {page: 1}.merge!(opts)
    YvApi.get("reading_plans/library", page: opts[:page], category: opts[:category], language_tag: opts[:language]).categories
  end

  def to_param
    @slug
  end

end
