class SystemMoment < YV::Resource
  
  include YV::Concerns::Moments

  attributes [:body, :title, :body_images]

  def kind
    "system"
  end

end