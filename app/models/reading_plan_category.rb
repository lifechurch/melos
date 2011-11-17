class ReadingPlanCategory
  extend ActiveModel::Naming
  include ActiveModel::Conversion
  include Model
  def persisted?
    false
  end

  attr_reader :errors, :parent_id, :id

  def self.find(category = nil)
    data = YvApi.get("reading_plans/library", category: category).categories
    if data.children.nil?
      children = []
    else
      children = data.children.map { |c| ReadingPlanCategory.new(id: c["category"], label: c["labels"], parent_id: parent) } unless data.children.nil?
    end
    ReadingPlanCategory.new(id: (data.current.nil? ? "root" : data.current.category), label: (data.current.nil? ? "root" : data.current.labels), children: children, parent_id: data.parent)
  end

  def initialize(opts = {})
    defaults = {parent_id: nil, id: nil, children: nil}
    initialize_class(self, opts, defaults)
  end

  def children
    @children ||= self.class.find(id).children
  end

  def find(category)
    data = YvApi.get("reading_plans/library", category: category).categories
  end

  def label
    i18nize(@label)
  end
end
