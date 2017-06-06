class Image < YV::Resource
  
  include YV::Concerns::Moments

  attributes [:images, :moment_title, :expanded_dt, :body_images, :action_url]

  def kind
    "image"
  end

  def image
    body_images.collection.sort_by{|i| i.width}.last.url if body_images.collection.present?
  end

  def to_path
    "/moments/#{id}"
  end

end