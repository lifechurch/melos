class Searchs

  attr_accessor :query
  attr_reader :version_id

  class << self

    def categories
      [:bible, :plans, :notes, :users] #:videos
    end

    def category_resource_paths
      {bible: "bible", plans: "reading_plans", notes: "notes", users: "users"} #, videos: "videos"
    end
  
    def category_item_names
      {bible: "verses", plans: "reading_plans", notes: "notes", users: "users"} #,videos: "videos"
    end

  end
  # END Class methods ------------------------------------------------------------------------


  def initialize (query, opts = {})
    params = {query: (@query = query.to_s)}
    @category = opts[:category].to_sym if opts[:category]
    params[:version_id] = @version_id = Version.id_from_param(opts[:version_id]) if opts[:version_id].present?
    # API says pass only version_id OR language_tag
    params[:language_tag] = opts[:locale].to_s if @version_id.blank?
    params[:cache_for] = YV::Caching.a_very_short_time

    @responses = Hashie::Mash.new()

    self.class.categories.each do |c|
      params[:page] = (@category == c) ? opts[:page] : nil #page only applies to a specific category
      resource = self.class.category_resource_paths[c]
      items = self.class.category_item_names[c]
      parameters = params

      # Set language tag for bible search if @version_id wasn't set above.
      if(c == :bible && params[:language_tag].present?)
        parameters[:language_tag] = YV::Conversions::to_bible_api_lang_code(parameters[:language_tag])
      end

      # Set language tag for search if it's for videos.
      parameters[:language_tag] = opts[:locale].to_s if(c == :videos)

      data, errors = YV::Resource.get("search/#{resource}", parameters)
      results = YV::API::Results.new(data,errors)

      @responses[c] = if results.valid?
         results.data
      else
         Hashie::Mash.new(suggestions: nil)
      end

      @responses[c].items ||= @responses[c][items]

    end
    @responses
  end

  def category
    @category || recommended_category
  end

  def suggestion
    return raw_results[category].suggestions.first if raw_results[category].suggestions.present?

    self.class.categories.each {|c| return raw_results[c].suggestions.first if raw_results[c].suggestions.present?}

    return nil
  end

  def raw_results
    @responses
  end

  def result_list(category)
    if @list.blank? || @list_category != category
      @list = ResourceList.new()
      @list.total = raw_results[category].total || 0
      @list.concat(raw_results[category].items) if raw_results[category].items
      @list_category = category
    end

    @list
  end

  def total_results
    @total_results ||= self.class.categories.map{|c| raw_results[c].total || 0}.inject(:+)
  end

  def has_results?
    self.class.categories.each {|c| return true if raw_results[c].total}
    return false
  end

  def recommended_category
    self.class.categories.each {|c| return c if raw_results[c].total}
    return self.class.categories.first
  end
end