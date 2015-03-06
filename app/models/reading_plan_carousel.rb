class ReadingPlanCarousel < YV::Resource
  
  include YV::Concerns::Moments

  attributes [:images, :moment_title, :expanded_dt, :category, :body_images]

  def kind
    "reading_plan_carousel"
  end

  def plans
    plans = Plan.all(category: self.category, page: 1, cache_for: YV::Caching.a_short_time, language_tag: I18n.locale)
    plans.take(8) if plans.present?
  end

end