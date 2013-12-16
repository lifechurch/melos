class Plan < YV::Resource

  api_response_mapper YV::API::Mapper::Plan

  attribute :id
  attribute :type
  attribute :slug
  attribute :name         # TODO: localize
  attribute :about        # TODO: localize
  attribute :short_url
  attribute :copyright    # TODO: localize
  attribute :total_days
  attribute :version_id
  attribute :created_dt
  attribute :default_start_dt
  attribute :formatted_length # TODO: localize
  attribute :publisher_url

  attribute :errors
  
  #attr_i18n_reader :about
  #attr_i18n_reader :name
  #attr_i18n_reader :formatted_length
  #attr_i18n_reader :copyright

  class << self

    def list_path
      "search/reading_plans"
    end

    def api_path_prefix
      "reading-plans"
    end

    # TODO pagination + facets

    def all(opts = {})
      opts[:query] = '*' if opts[:query].blank?
      opts[:cache_for] ||= YV::Caching.a_long_time
      opts[:cache_for] = 0 if opts[:user_id].present?
      super(opts)
    end


    def find(param, opts ={})
      id, slug = id_and_slug_from_param param
      raise YouVersion::API::RecordNotFound unless id.present?
      # Dont cache if we tell cache_for to be zero (coming from subscription)
      opts[:cache_for] = (opts[:cache_for] == 0) ? nil : YV::Caching.a_long_time
      super(id, opts)
    end


    def id_and_slug_from_param(param)
      case param
        when /\A(\d+)-(.+)/    # format 1234-plan-slug
          return param.match(/\A(\d+)-(.+)/)[1].to_i, param.match(/\A(\d+)-(.+)/)[2]
        when Plan
          return param.id, param.slug
        else return nil
      end
    end

    # Overriding the key used to lookup localized data returned via the API
    # in this case we support pt-BR as locale, but the API returns localized data with a key of "pt"
    # we need to make sure the data is looked up with the proper key, rather than the key web platform supports :(
    def i18n_key_override(key)
      case key
      when /pt-BR|pt_BR/
        "pt"
      else
        key
      end
    end


  end
  # END Class method definitions ------------------------------------------------------------------------


  def initialize(data={})
    super(data)
    @readings = {}
  end


  def current_day
    1
    #just give the first day if requested for a plan
    #(i.e. not in context of a subscription)
  end


  # we don't auth or send user_id because this is just a plan (not a subscription) that doesn't know about a user
  # to be overriden by Subscription model to send auth and user_id
  # we can cache the non-authed response
  def reading(day, opts = {})
    key = day.to_s.to_sym
    return @readings.fetch(key) if @readings.has_key?(key)
    reading = Plans::Reading.find({id: self.id, day: day}.merge(opts))
    @readings.store(key, reading)
    return reading
  end

  def day(day, opts = {})
    reading(day, opts)
  end

  def days
    total_days
  end

  def readings
    total_days
  end  

  def title
    name
  end

  def description
    about
  end

  def length
    formatted_length
  end

  def to_param
    "#{id}-#{slug}"
  end

  def ==(compare)
    #if plan is compared to subscription or vice/versa
    correct_class = compare.class == Plan || compare.class == Subscription

    correct_class && self.id == compare.id
  end

end
