class Device < YV::Resource

  attribute :vendor
  attribute :model
  attribute :os
  attribute :device_id
  attribute :notes
  attribute :carrier
  attribute :created
  attribute :created_dt

  class << self

    def destroy_id_param
      :id
    end

    def list_path
      "users/items_device"
    end

    def resource_path
      "users/view_device"
    end

    def create_path
      "users/set_device"
    end

    def update_path
      "users/set_device"
    end

    def delete_path
      "users/delete_device"
    end

    def for_user(user_id, params = {})
      all(params.merge id:user_id)
    end

  end

  def created_date
    Date.parse(self.created_dt)
  end
end
