class YvApi
  include HTTParty
  format :json
  base_uri(Cfg.api_root + "/" + Cfg.api_version)
  headers 'Referer' => Cfg.api_root

  class << YvApi
    alias_method :httparty_get, :get
    alias_method :httparty_post, :post
  end

  def self.get(path, opts={}, &block)
    default_options[:basic_auth] = nil
    basic_auth opts.delete(:auth_username), opts.delete(:auth_password) if (opts[:auth_username] && opts[:auth_password])
    # Clean up the path
    path = clean_up(path)
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
    return api_response_or_rescue(response, block)
  end

  def self.post(path, opts={}, &block)
    default_options[:basic_auth] = nil
    path = clean_up(path)
    basic_auth opts.delete(:auth_username), opts.delete(:auth_password) if (opts[:auth_username] && opts[:auth_password])
    response = httparty_post(path, body: opts)
    return api_response_or_rescue(response, block)

  end

  private

  def self.clean_up(path)
    path = "/" + path unless path.match(/^\//)
    path += ".json" unless path.match(/\.json$/)
    return path
  end


  def self.api_response_or_rescue(response, block)
    if response["response"]["code"].to_i >= 400
      # If there's a block, use it for a substitute API call
      new_response = block.call(response["response"]["data"]["errors"]) if block
      # If the block didn't return a substitute array, throw an exception based on the original error
      raise("API Error: " + response["response"]["data"]["errors"].map { |e| e["error"] }.join("; ")) unless new_response
      # If it DID work, use the response from the block as the new response
      return new_response
    end
    # creating a resource? Just return success
    return true if response["response"]["code"] == 201
    # Otherwise, turn the data back into a Mash and return it
    return response["response"]["data"].class == Array ? response["response"]["data"].map {|e| Hashie::Mash.new(e)} : Hashie::Mash.new(response["response"]["data"])
  end
end
