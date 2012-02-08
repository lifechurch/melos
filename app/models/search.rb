class Search
  
  attr_accessor :query
  
  def self.categories
    [:bible, :plans, :notes, :users]
  end
  
  def initialize (query, opts = {})
    opts[:query] = @query = query.to_s
    
    @responses = Hashie::Mash.new()
    
    self.class.categories.each do |c|
      resource = self.class.category_api_strings[c]
      @responses[c] = YvApi.get("#{resource}/search", opts) do |errors|
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
  
  def results
    @responses 
  end
  
  def total_results
    @total_results ||= self.class.categories.map{|c| @responses[c].total || 0}.inject(:+)
  end
  
  def has_results?
    self.class.categories.each {|c| return true if results[c].total}
    return false
  end
  
  def recommended_category
    self.class.categories.each {|c| return c if results[c].total}
    return self.class.categories.first
  end
  
  def self.category_api_strings
    {bible: "bible", plans: "reading_plans", notes: "notes", users: "users"}
  end
end