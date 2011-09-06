class CachingAPI
  # This class adds a memcache layer over the HTTParty
  # get method. To cache the results of a get request,
  # include a :cache_for => 2.minutes or whatever in
  # the request. Otherwise, it acts just like HTTParty.
  #

  include HTTParty
  class << CachingAPI
    alias_method :httparty_get, :get
  end

  def self.get(path, opts = {})
    # if a cache_time is set, try to read it from memcache
    if opts[:cache_for]
      cache_key = {:p => path, :q => opts[:query]}
      Rails.cache.fetch cache_key, :expires_in => opts[:cache_for] do
        httparty_get(path, opts)
      end
    else
      httparty_get(path, opts)
    end
  end

end

