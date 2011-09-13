class YvApi
  include HTTParty
  format :json
  base_uri(Cfg.api_root + "/" + Cfg.api_version)
  headers 'Referer' => Cfg.api_root

  class << YvApi
    alias_method :httparty_get, :get
  end

  def self.caching_get(path, opts = {})
    # If a cache_time is set, try to read it from memcache
  end

  def self.get(path, opts={})
    # Clean up the path
    path = "/" + path unless path.match(/^\//)
    path += ".json" unless path.match(/\.json$/)

    # Figure out if we should cache
    cache_length = opts.delete(:cache_for)

    # If we should cache, try pulling from cache first
    if cache_length
      cache_key = {p: path, q: opts}
      Rails.cache.fetch cache_key, expires_in: cache_length do
        # No cache hit; ask the API
        response = httparty_get(path, query: opts)
      end
    else
      # Just ask the API
      response = httparty_get(path, query: opts)
    end

    # Check the API response for error code
    if response["response"]["code"].to_i >= 400
      # If there's a block, use it for a substitute API call
      new_response = yield response["response"]["data"]["errors"] if block_given?
      # If the block didn't return a substitute array, throw an exception based on the original error
      raise("API Error: " + response["response"]["data"]["errors"].map { |e| e["error"] }.join("; ")) unless new_response
      # If it DID work, use the response from the block as the new response
      return new_response
    end
    return response["response"]["data"].class == Array ? response["response"]["data"].map {|e| Hashie::Mash.new(e)} : Hashie::Mash.new(response["response"]["data"])

  end
end
