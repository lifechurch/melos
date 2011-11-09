class YvModel

  extend ActiveModel::Naming
  include ActiveModel::Conversion
  include YvModule

  def persisted?
    return !id.blank?
  end

  def self.defaults
    @defaults
  end

  def initialize(opts = {})
    opts = self.class.defaults.merge(opts) if self.class.defaults
    hash_to_vars(opts)
  end
end
