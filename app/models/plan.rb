class Plan < YV::Resource

  include YV::Concerns::Searchable
  api_response_mapper YV::API::Mapper::Plan

  attribute :id
  attribute :type
  attribute :slug
  attribute :name        
  attribute :about       
  attribute :short_url
  attribute :copyright   
  attribute :total_days
  attribute :version_id
  attribute :created_dt
  attribute :default_start_dt
  attribute :formatted_length
  attribute :publisher_url
  attribute :images
  attribute :language_tag
  attribute :errors

  #attr_i18n_reader :about
  #attr_i18n_reader :name
  #attr_i18n_reader :formatted_length
  #attr_i18n_reader :copyright

  class << self

    # Path used by YV::Concerns::Searchable and defined class.search method
    def search_path
      "search/reading_plans"
    end

    # self.search(query,opts)
    # available options:
    # - page: page number to return
    # - category:   (optional) category for filtering
    # - total_days: (optional) will accept one of the predefined ranges to limit results to '1_day_to_7_days', '1_week_to_1_month', '1_month_to_3_months', '3_months_to_6_months', '6_months_to_1_year', '1_year_to_infinity', it's optional
    # - language_tag: (optional) language for filtering
    # - sort: (optional) ordering results. defaults to score, accepts total_days

    def list_path
      "search/reading_plans"
    end

    def api_path_prefix
      "reading-plans"
    end

    # TODO pagination + facets

    def all(opts = {})
      cache_time = request_for_user?(opts) ? 0 : YV::Caching.a_long_time
      cache_for(cache_time, opts)
      opts[:query] = '*' if opts[:query].blank?
      super(opts)
    end

    def featured(opts={})
      all opts.merge(category: "featured_plans")
    end


    def find(param, opts ={})
      id, slug = id_and_slug_from_param param
      raise YouVersion::API::RecordNotFound unless id.present?
      # Dont cache if we tell cache_for to be zero (coming from subscription)
      opts[:cache_for] = (opts[:cache_for] == 0) ? nil : YV::Caching.a_long_time
      super(id, opts)
    end


    def id_and_slug_from_param(param)
      if param.class == Plan
        return param.id, param.slug
      elsif param.class == String
        # format 1234-plan-slug
        id = param.match(/\A(\d+)-(.+)/)
        id = id[1].to_i unless id.nil?
        slug = param.match(/\A(\d+)-(.+)/)
        slug = slug[2].to_i unless slug.nil?
        #if only plan id is present:
        id = param.to_i if id.nil? and param.match(/^\d+$/) rescue nil
        return id, slug
      else
        return nil
      end
    end

    # Overriding the key used to lookup localized data returned via the API
    # in this case we support pt-BR as locale, but the API returns localized data with a key of "pt"
    # we need to make sure the data is looked up with the proper key, rather than the key web platform supports :(
    def i18n_key_override(key)
      case key
      when /pt-BR|pt_BR/
        "pt"
      when 'es-ES'
        'es'
      when 'zh-CN'
        'zh_CN'
      when 'zh-TW'
        'zh_TW'
      else
        key
      end
    end


    # Check if an API call is for a specific user (user_id is present in options)
    def request_for_user?(opts)
      opts[:user_id].present?
    end



  end
  # END Class method definitions ------------------------------------------------------------------------


  def initialize(data={})
    super(data)
    @readings = {}
  end

  def hero_image
    # Sort by height ascending, then return the first only if it's greater than 600px wide
     images.sort_by { |h| h.height }.detect { |h| h.width >= 600 } if images.present?
  end

  def search_thumbnail_image
    # Sort by height descending, then return the first only if it's greater than 200px wide
     images.sort_by { |h| h.height }.reverse!.detect { |h| h.width <= 320 } if images.present?
  end

  def widget_thumbnail_image
    # Sort by height ascending, then return the first only if it's width is between 50 & 200 inclusive
     images.sort_by { |h| h.height }.detect { |h| h.width >= 50 && h.width <= 200 } if images.present?
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
