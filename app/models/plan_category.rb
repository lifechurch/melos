class PlanCategory

  attr_reader :slug

  def name
      YV::Resource.i18nize(@json.labels)
  end

    # {"category"=>"devotional",
    #   "labels"=>
    #    {"default"=>"Devotional",
    #     "en"=>"Devotional",
    #     "cs"=>"Rozjímání",
    #     "de"=>"Andacht",
    #     "es"=>"Devocional",
    #     "fr"=>"Méditation quotidienne" ...
  def initialize(json_category_mash)
    @json = json_category_mash
    @slug = json_category_mash.try(:category) || ""
  end

end
