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
    base = get_base_url!(opts)
    path = clean_up(path)
    resource_url = base + path
    Rails.logger.info "** YvApi.get: Calling #{resource_url} with query => #{opts}"
    if (resource_url == "http://api.yvdev.com/2.3/bible/verse.json")
      calling_method = caller.first.match(/`(.*)'$/)[1]
      # puts "** YvApi.get: Called from #{calling_method}"
      # puts "Top 5 Callers:"
      # pp caller[0..4]
    end
    # If we should cache, try pulling from cache first
    if cache_length = opts.delete(:cache_for)
      cache_key = [path, opts.sort].flatten.join("_")
      puts "*** cache_key is #{cache_key}"
      Rails.cache.fetch cache_key, expires_in: cache_length do
        # No cache hit; ask the API
        response = httparty_get(resource_url, query: opts)
      end
    else
      # Just ask the API
      get_start = Time.now.to_f
      response = httparty_get(resource_url, query: opts)
      get_end = Time.now.to_f
    Rails.logger.info "** YvApi.get: Response time: #{((get_end - get_start) * 1000).to_i}ms"
    end
    # Check the API response for error code
    return api_response_or_rescue(response, block)
  end

  def self.post(path, opts={}, &block)
    auth_from_opts!(opts)
    base = get_base_url!(opts)
    path = clean_up(path)
    resource_url = base + path
    # Rails.logger.info "** YvApi.post: Calling #{resource_url} with body => #{opts}"
    Rails.logger.info "** YvApi.post: Calling #{resource_url} with body => #{opts}"

    post_start = Time.now.to_f
    response = httparty_post(resource_url, body: opts)
    post_end = Time.now.to_f
    Rails.logger.info "** YvApi.post: Response: #{response}"
    Rails.logger.info "** YvApi.post: Resonse time: #{((post_end - post_start) * 1000).to_i}ms"
    return api_response_or_rescue(response, block)
  end

  private

  def self.auth_from_opts!(opts)
    # Clear the auth state or it'll keep it around between requests
    default_options.delete(:basic_auth)

    # For login
    basic_auth opts.delete(:auth_username), opts.delete(:auth_password) if (opts[:auth_username] && opts[:auth_password])

    # TODO: Clean up the call around this so it's unnecessary
    a = Hashie::Mash.new(opts.delete(:auth)) if opts[:auth]

    # For auth'ed API calls with :user => current_user    
    basic_auth a.username, a.password if a
  end

  def self.clean_up(path)
    path = "/" + path unless path.match(/^\//)
    path += ".json" unless path.match(/\.json$/)
    return path
  end

  def self.get_base_url!(opts)
    api_version = opts.delete(:api_version)
    use_secure = opts.delete(:secure)
    # Set the request protocol
    protocol = use_secure ? 'https' : 'http'
    # Set the base URL
    base = (protocol + "://" + Cfg.api_root + "/" + (api_version || Cfg.api_version))
  end

  def self.api_response_or_rescue(response, block)
    if response["response"]["code"].to_i >= 400
      puts "i'm in the error block thingy"
      puts "response data errors is #{response["response"]["data"]["errors"]}"
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
    case response["response"]["data"]
      when Array
        if response["response"]["data"].first.respond_to?(:each_pair)
          response["response"]["data"].map {|e| Hashie::Mash.new(e)}
        else
          response["response"]["data"]
        end
      when Hash
        Hashie::Mash.new(response["response"]["data"])
      when Fixnum
        # only for users/user_id
        Hashie::Mash.new({user_id: response["response"]["data"] })
      end
  end
end
