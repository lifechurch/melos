# Vendor class related to Licenses.
# API Currently undocumented.

class Vendor < YV::Resource

  attribute :id
  attribute :name
  attribute :links

  def self.api_path_prefix
    "vendors"
  end

end