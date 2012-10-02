class Search

  attr_accessor :query
  attr_reader :version_id

  def self.categories
    [:bible, :plans, :notes, :users]
  end

  def self.category_resource_paths
    {bible: "bible", plans: "reading_plans", notes: "notes", users: "users"}
  end
  def self.category_item_names
    {bible: "verses", plans: "reading_plans", notes: "notes", users: "users"}
  end

  def initialize (query, opts = {})
    params = {query: (@query = query.to_s)}
    @category = opts[:category].to_sym if opts[:category]
    params[:version_id] = @version_id = Version.id_from_param(opts[:version_id]) if opts[:version_id].present?
    # API says pass only version_id OR language_tag
    params[:language_tag] = opts[:locale].to_s if @version_id.blank?
    params[:cache_for] = 2.minutes

    @responses = Hashie::Mash.new()

    self.class.categories.each do |c|
      params[:page] = (@category == c) ? opts[:page] : nil #page only applies to a specific category
      resource = self.class.category_resource_paths[c]
      items = self.class.category_item_names[c]
      parameters = params
      if(c == :bible && params[:language_tag].present?)
        parameters[:language_tag] = YvApi::to_bible_api_lang_code(parameters[:language_tag])
      end
      @responses[c] = YvApi.get("search/#{resource}", parameters) do |errors, response|
        #treat any error as empty results for now, but return suggestions if there were any
        Hashie::Mash.new(suggestions: response.try(:[], 'response').try(:[], 'data').try(:[], 'suggestions'))
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