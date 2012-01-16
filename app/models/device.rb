class Device < YouVersion::Resource
  attribute :vendor
  attribute :model
  attribute :os
  attribute :device_id
  attribute :notes
  attribute :carrier
  attribute :created

  def self.list_path
    "users/items_device"
  end

  def self.resource_path
    "users/view_device"
  end

  def self.create_path
    "users/set_device"
  end

  def self.update_path
    "users/set_device"
  end

  def self.delete_path
    "users/delete_device"
  end

  def self.for_user(user_id, params = {})
    all(params.merge({:id => user_id}))
  end

  def created_date
    Date.parse(self.created)
  end
end
