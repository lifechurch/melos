class PlanCategory
  #TODO: roll this class into the category listing class as a psuedo object with Mash?
  attr_reader :slug

  def name
      YV::Resource.i18nize(@json.labels)
  end

  def initialize(json_category_mash)
    # {"category"=>"devotional",
    #   "labels"=>
    #    {"default"=>"Devotional",
    #     "en"=>"Devotional",
    #     "cs"=>"Rozjímání",
    #     "de"=>"Andacht",
    #     "es"=>"Devocional",
    #     "fr"=>"Méditation quotidienne",
    #     "ja"=>"デボーション",
    #     "ko"=>"묵상",
    #     "nl"=>"Toewijding",
    #     "no"=>"Andakt",
    #     "pl"=>"Rozważanie",
    #     "pt"=>"Devocional",
    #     "ro"=>"Devoțional",
    #     "ru"=>"\"Золотой стих\"",
    #     "sk"=>"náboženského zamerania",
    #     "sv"=>"Dagliga betraktelser",
    #     "vi"=>"Tĩnh Nguyện",
    #     "zh_CN"=>"灵修的",
    #     "zh_TW"=>"靈修的"}},
    @json = json_category_mash
    @slug = json_category_mash.try(:category) || ""
  end

end
