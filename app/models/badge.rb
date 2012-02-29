class Badge < YouVersion::Resource
  attr_i18n_reader :name
  attr_i18n_reader :description
  attribute :type
  attribute :image_url
  attribute :slug
  attribute :username

  def earned
    Date.parse(attributes["earned"])
  end

  def to_param
    self.slug
  end
end
