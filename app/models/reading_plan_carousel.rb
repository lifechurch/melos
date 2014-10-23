class ReadingPlanCarousel < YV::Resource
  
  include YV::Concerns::Moments

  attributes [:images, :moment_title, :expanded_dt, :category, :body_images]

  def kind
    "reading_plan_carousel"
  end

  def plans
    Plan.all(category: self.category, page: 1, cache_for: YV::Caching.a_very_short_time).take(8)
  end

end