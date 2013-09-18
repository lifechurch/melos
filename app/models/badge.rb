class Badge < YV::Resource
  
  attribute :slug
  attribute :type
  attribute :username
  attribute :image_url

  attr_i18n_reader :name
  attr_i18n_reader :description

  def earned
    Date.parse(attributes["earned_dt"])
  end

  def to_param
    self.slug
  end
  
end
