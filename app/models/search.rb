class Search

  attr_accessor :query
  attr_reader :version

  def self.categories
    [:bible, :plans, :notes, :users]
  end

  def initialize (query, opts = {})
    params = {query: (@query = query.to_s)}
    @category = opts[:category].to_sym if opts[:category]
    params[:version] = @version = (opts[:version].to_s == "") ? nil : opts[:version]
    params[:language_tag] = opts[:locale].to_s if @version.nil? # API says only version OR language_tag

    @responses = Hashie::Mash.new()

    self.class.categories.each do |c|
      params[:page] = (@category == c) ? opts[:page] : nil #page only applies to a specific category
      resource = self.class.category_api_strings[c]
      @responses[c] = YvApi.get("#{resource}/search", params) do |errors|
        # if errors.length == 1 && [/^No(.*)found$/, /^(.*)s not found$/].detect { |r| r.match(errors.first["error"]) }
        #           Hashie::Mash.new()
        #         else
        #           raise ResourceError.new(errors)
        #         end
        Hashie::Mash.new()
      end
      @responses[c].items ||= @responses[c][resource.to_sym]

    end
    @responses
  end

  def category
    @category || recommended_category
  end

  def suggestion
    return raw_results[category].suggestion if raw_results[category].suggestion.to_s != ""

    self.class.categories.each {|c| return raw_results[c].suggestion if raw_results[c].suggestion.to_s != ""}

    return nil
  end

  def raw_results
    @responses
  end

  def result_list(category)
    if @list.nil?
      @list = ResourceList.new()
      @list.total = raw_results[category].total || 0
      @list << raw_results[category].items if raw_results[category].items
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

  def self.category_api_strings
    {bible: "bible", plans: "reading_plans", notes: "notes", users: "users"}
  end
end