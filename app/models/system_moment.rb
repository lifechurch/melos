class SystemMoment < YV::Resource
  
  include YV::Concerns::Moments

  attributes [:body_text, :body_images]

  def kind
    "system"
  end

end