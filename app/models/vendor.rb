class Vendor < YouVersion::Resource

  attribute :id
  attribute :name
  attribute :links

  def self.api_path_prefix
    "vendors"
  end

end