class ReadingPlanCarouselMoment < YV::Resource
  
  include YV::Concerns::Moments

  # attributes [:body_text, :body_images, :action_url]

  def kind
    "reading_plan_carousel"
  end

end