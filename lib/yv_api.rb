class YvApi < CachingAPI
  format :json
  base_uri(Cfg.api_root + "/" + Cfg.api_version)
  headers 'Referer' => Cfg.api_root
  
  class << YvApi
    alias_method :caching_get, :get
  end

  def self.get(path, opts={})
    path = "/" + path unless path.match(/^\//)
    path.sub!(".json", "")
    cache_for = opts.delete(:cache_for)
    caching_get(path + ".json", :cache_for => cache_for, :query => opts)
  end
end
