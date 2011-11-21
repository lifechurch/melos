class YvApi
  include HTTParty
  format :json
  headers 'Referer' => "http://" + Cfg.api_referer

  class << YvApi
    alias_method :httparty_get, :get
    alias_method :httparty_post, :post
  end

  def self.get(path, opts={}, &block)
    auth_from_opts!(opts)
    base = get_base_url(opts.delete(:secure))
    path = clean_up(path)
    resource_url = base + path
    # puts "** YvApi.get: Calling #{resource_url} with query => #{opts}"
    if (resource_url == "http://api.yvdev.com/2.3/bible/verse.json")
      calling_method = caller.first.match(/`(.*)'$/)[1]
      # puts "** YvApi.get: Called from #{calling_method}"
      # puts "Top 5 Callers:"
      # pp caller[0..4]
    end
    # If we should cache, try pulling from cache first
    if cache_length = opts.delete(:cache_for)
      cache_key = {p: path, q: opts}
      Rails.cache.fetch cache_key, expires_in: cache_length do
        # No cache hit; ask the API
        response = httparty_get(resource_url, query: opts)
      end
    else
      # Just ask the API
      response = httparty_get(resource_url, query: opts)
    end

    # Check the API response for error code
    return api_response_or_rescue(response, block)
  end

  def self.post(path, opts={}, &block)
    auth_from_opts!(opts)
    base = get_base_url(opts.delete(:secure))
    path = clean_up(path)
    resource_url = base + path
    # puts "** YvApi.post: Calling #{resource_url} with body => #{opts}"

    response = httparty_post(resource_url, body: opts)

    return api_response_or_rescue(response, block)
  end

  private

  def self.auth_from_opts!(opts)
    # Clear the auth state or it'll keep it around between requests
    default_options.delete(:basic_auth)

    # For login
    basic_auth opts.delete(:auth_username), opts.delete(:auth_password) if (opts[:auth_username] && opts[:auth_password])
    # For auth'ed API calls with :user => current_user
    basic_auth opts[:auth].username, opts.delete(:auth).password if opts[:auth]
  end

  def self.clean_up(path)
    path = "/" + path unless path.match(/^\//)
    path += ".json" unless path.match(/\.json$/)
    return path
  end

  def self.get_base_url(use_secure = nil)
    # Set the request protocol
    protocol = use_secure ? 'https' : 'http'
    # Set the base URL
    base = (protocol + "://" + Cfg.api_root + "/" + Cfg.api_version)
  end

  def self.api_response_or_rescue(response, block)
    if response["response"]["code"].to_i >= 400
      # If there's a block, use it for a substitute API call
      new_response = block.call(response["response"]["data"]["errors"]) if block
      # If the block didn't return a substitute array, throw an exception based on the original error
      raise("API Error: " + response["response"]["data"]["errors"].map { |e| e["error"] }.join("; ")) unless !new_response.nil?
      # If it DID work, use the response from the block as the new response
      return new_response
    end

    # creating a resource? Just return success
    # -- Won't work because we need to 'show' the newly created record and we would not have the ID yet. Commented -- Caedmon
    # return true if response["response"]["code"] == 201
    return true if (response["response"]["code"] ==  201 and response["response"]["data"] == "Created")

    return true if response["response"]["code"] == 200 && response["response"]["data"] == "OK"

    # Otherwise, turn the data back into a Mash and return it
    return response["response"]["data"].class == Array ? response["response"]["data"].map {|e| Hashie::Mash.new(e)} : Hashie::Mash.new(response["response"]["data"])
  end
end
