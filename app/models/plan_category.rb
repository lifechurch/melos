class PlanCategory

  attr_reader :slug

  def name
      @json ? YouVersion::Resource.i18nize(@json.labels): nil
  end

  def initialize(json_category_mash)
    @json = json_category_mash
    @slug = json_category_mash ? json_category_mash.category : ""
  end

end
