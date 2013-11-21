class Badge < YV::Resource

  # Only need mapper for #all, #find
  api_response_mapper YV::API::Mapper::Badge

  
  attribute :name
  attribute :slug
  attribute :type
  attribute :user_id
  attribute :username
  attribute :image_url
  attribute :description
  attribute :earned_dt


  class << self


    # Badge.all(opts)
    # http://developers.youversion.com/api/docs/3.1/sections/badges/items.html

    # options
    # - user_id: required {user_id: 12345}
    # - page: optional {page: 3}

    # returns
    # an YV::API::Results wrapper for array of Badge instances





    # Badge.find(id,opts)
    # http://developers.youversion.com/api/docs/3.1/sections/badges/view.html

    # options
    # - id: required (first method parameter)
    # - user_id: optional {user_id: 12345}

    # returns
    # an YV::API::Results wrapper for an instance of Badge






    # Badge.ids(opts)
    # http://developers.youversion.com/api/docs/3.1/sections/badges/all_items.html

    # options
    # - user_id: required {user_id: 12345}

    # returns
    # a complete array of Badge ids that the user has earned


    def ids_path
      "badges/all_items"
    end

    def ids(opts={})
      data,errs = get(ids_path, opts.slice(:user_id))
      return YV::API::Results.new(data,errs)
    end

  end


  def earned
    Date.parse(earned_dt)
  end

  def to_param
    self.slug
  end
  
end
