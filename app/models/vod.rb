class VOD < YV::Resource

  class << self


    def all(opts={})
      data, errs = YV::Resource.get("bible/verse_of_the_day", opts.merge(cache_for: YV::Caching.a_very_long_time))
      return data
    end


    def today
      today = Date.today.yday
      all.detect {|d| d.day == today}
    end


  end

end