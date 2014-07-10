# 
# 

class VodSubscription < YV::Resource

  attributes [:push, :email]
  api_response_mapper YV::API::Mapper::Base

  class << self

    def create(opts={})
      raise YV::AuthRequired unless opts[:auth]
      super(opts)
    end

    def list_path
      'notifications/votd_subscription'
    end

    def create_path
      'notifications/update_votd_subscription'
    end

    def delete_path
      'notifications/update_votd_subscription'
    end

    # API Response after creating a VodSubscription.

    # {
    #     "response": {
    #         "buildtime": "2013-05-08T20:34:11+00:00",
    #         "code": 201
    #     }
    # }

    def delete(opts={})
      raise YV::AuthRequired unless opts[:auth]
      data,errs = post(delete_path,opts)  
      # map_delete(YV::API::Results.new(data,errs))
    end

  end

end