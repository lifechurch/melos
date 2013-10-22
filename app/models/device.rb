class Device < YV::Resource

  api_response_mapper YV::API::Mapper::Device


  attribute :vendor
  attribute :model
  attribute :os
  attribute :device_id
  attribute :notes
  attribute :carrier

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

    def delete_path
      "users/delete_device"
    end





    # Device.all( opts )
    # returns all devices for a given user and auth

    # options
    # - auth: required {auth: auth_hash}
    # - id: required {id: 12345} - id of user to find devices for

    # Returns a YV::API::Results decorator for an array of Device instances.







    # Device.for_user( user_id, opts )
    # returns all devices for a given user and auth

    # options
    # - auth: required {auth: auth_hash}

    # Returns a YV::API::Results decorator for an array of Device instances.

    def for_user(user_id, params = {})
      raise YV::AuthRequired unless opts[:auth]
      all(params.merge(id: user_id))
    end

  end

  def created_at
    Date.parse(self.created_dt)
  end
end
