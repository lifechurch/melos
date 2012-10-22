class Plan < YouVersion::Resource

  attribute :errors
  attribute :publisher_url
  attribute :id
  attribute :slug
  attribute :version_id
  attr_i18n_reader :about
  attr_i18n_reader :name
  attr_i18n_reader :formatted_length
  attr_i18n_reader :copyright

  def self.list_path
    "search/reading_plans"
  end

  def self.api_path_prefix
    "reading-plans"
  end

  def self.available_locales
    #return @available_locales if @available_locales

    response = YvApi.get("#{api_path_prefix}/configuration", {cache_for: a_long_time}) do |errors|
      raise YouVersion::ResourceError.new(errors)
    end

    @available_locales = response.available_language_tags.map{|tag| YvApi::to_app_lang_code(tag).to_sym}
  end

  def self.find(id, opts = {}, &block)
    id = id_from_param id

    super(id, opts) do |errors|
      if errors.length == 1 && [/^Reading plan not found$/].detect { |r| r.match(errors.first["error"]) }
        return nil
      else
        raise YouVersion::ResourceError.new(errors)
      end
    end
  end

  def self.all(opts = {})
    opts[:query] ||= '*'
    super(opts)
  end

  def self.subscribe (plan, user_auth)
    _auth = user_auth
    opts = {auth: user_auth}
    opts[:id] = id_from_param plan

    response = YouVersion::Resource.post("#{api_path_prefix}/subscribe_user", opts)

    Subscription.new(response.merge(auth: _auth))

    #EVENTUALLY: Do this correctly with Resource abstraction and on the subscription class(new) and user object(add_subscription) class
  end

  def self.id_from_param(param)
    case param
      when /^(\d+)[-](.+)/    # format 1234-plan-slug
        param.match(/^(\d+)[-](.+)/)[1].to_i
      when Fixnum, /\A[\d]+\z/
        param.to_i
      when String             #slug was passed
        #try to get id from slug with search, since API doesn't give a better way
        lib_plan = Plan.search(param).find{|plan| plan.slug.downcase == param.downcase}
        return nil if lib_plan.blank?
        lib_plan.id
      when Plan
        param.id.to_i
    end
  end

  def subscribe (user_auth, opts = {})
    self.class.subscribe(self, user_auth)
  end

  def current_day
    1
    #just give the first day if requested for a plan
    #(i.e. not in context of a subscription)
  end

  def users(params = {})
    #if !@users || (params[:page] != @users_page)
      params[:id] = id
      @users_page = params[:page] ||= 1

      response = YvApi.get("#{api_path_prefix}/users", params) do |errors|
        if errors.length == 1 && [/^No(.*)found$/, /^(.*)s not found$/].detect { |r| r.match(errors.first["error"]) }
          return []
        else
          raise YouVersion::ResourceError.new(errors)
        end
      end

      @users = ResourceList.new
      @users.total = response.total
      response.users.each {|user| @users << Hashie::Mash.new({user: User.new(user.merge(:auth => params[:auth])), date: user.start_dt})}
    #end
    @users
  end

  def reading(day, opts = {})
    unless(@reading && @reading_day == day && @reading_version == version_id)
      opts[:day] ||= day
      opts[:id] ||= id
      opts[:cache_for] ||= a_very_long_time
      opts.delete :cache_for if opts[:cache_for] == 0
      # we don't auth or send user_id because this is just a plan (not a subscription) that doesn't know about a user
      # to be overriden by Subscription model to send auth and user_id
      # we can cache the non-authed response
      response = YvApi.get("#{api_path_prefix}/references", opts) do |errors|
        raise YouVersion::ResourceError.new(errors)
      end

      process_references_response(response)
    end

    @reading
  end

  def process_references_response(response)
      @reading_day = response.day.to_i
      @reading_version = version_id

      #TODO: it probably makes sense for a reading to be it's own class within Plan
      #      so this should all be done resourcefully in a after_create class, etc
      @reading = Hashie::Mash.new()

      #get localized html || text via i18nize method and massage a bit
      if @reading.devotional = YouVersion::Resource.i18nize(response.additional_content)
        # if ascii spacing is in the html, just remove it, instead of adding p's
        # to avoid adding unecessarry spacing
        spacer = YouVersion::Resource.html_present?(response.additional_content) ? '' : '</p><p>'
        @reading.devotional = @reading.devotional.gsub(/(\r\n\r\n|\n\n|\r\n|\n|\u009D)/, spacer)
        @reading.devotional = "<p>" << @reading.devotional << "</p>" if spacer.present?
      end

      @reading.references = response.references.map do |data|
        Hashie::Mash.new(ref: Reference.new(data.reference, version: @reading_version || Version.default),
                         completed?: (data.completed || data.completed == "true"))
      end
  end

  def day(day, opts = {})
    reading(day, opts)
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

  def total_days
    @total_days ||= @attributes.total_days.to_i
  end

  def days
    total_days
  end

  def readings
    total_days
  end

  def to_param
    "#{id}-#{slug}"
  end

  def ==(compare)
    #if plan is compared to subscription or vice/versa
    correct_class = compare.class == Plan || compare.class == Subscription

    correct_class && self.id == compare.id
  end

  def available_in?(lang_code)
    lang_key = YvApi::to_api_lang_code(lang_code)

    @attributes["about"].has_key?(lang_key) || @attributes["about"].html.has_key?(lang_key) || @attributes["about"].text.has_key?(lang_key)
  end

  private

  def self.search(query, params = {})
    #     Parameters:
    #     query of what you're wanting to search for
    #     category  to filter reading plans to (optional)
    #     total_days  will accept one of the predefined ranges to limit results to '1_day_to_7_days', '1_week_to_1_month', '1_month_to_3_months', '3_months_to_6_months', '6_months_to_1_year', '1_year_to_infinity', it's optional
    #     language_tag  to filter reading plans to (optional, but highly recommended for best search results)
    #     sort  the ordering of the results, defaults to 'score' (relevance), also accepts 'total_days'
    #     page  number of results to return
    query = '*' if (query == "" || query == nil)
    params = {query: query, cache_for: a_long_time}.merge!(params.except("query", :query))

    response = YvApi.get(list_path, params) do |errors|
      if errors.length == 1 && [/^No(.*)found$/, /^(.*)s not found$/, /^Search did not match any documents$/].detect { |r| r.match(errors.first["error"]) }
        return []
      else
        raise YouVersion::ResourceError.new(errors)
      end
    end

    list = ResourceList.new
    list.total = response.total
    response.reading_plans.each {|data| list << Plan.new(data.merge(:auth => params[:auth]))}
    list
  end
end
