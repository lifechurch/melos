class GenericMoment < YV::Resource

  include YV::Concerns::Moments

  attr_accessor :body_images,
                :body_text

  def kind
    "generic"
  end

end