class Badge < YouVersion::Resource
  attr_i18n_reader :name
  attr_i18n_reader :description
  attribute :type
  attribute :image_url
  attribute :slug

  def earned
    Date.parse(attributes["earned"])
  end
end
