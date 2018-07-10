class VOD < YV::Resource

  include YV::Concerns::Moments

  attributes [:references,:version,:recent_versions,:day,:week_day,:date,:created_at]
  api_response_mapper YV::API::Mapper::VerseOfTheDay

  class << self

    def kind
      "votd"
    end

    def list_path
      "bible/verse_of_the_day"
    end

    def all(opts={})
      cache_for(YV::Caching.a_very_long_time, opts)
      super(opts.slice(:cache_for))
    end

    def day(day,opts={})
      every_votd = all(opts)
      # for every votd, let's add an alternate votd reference in case the first doesn't exist for the version
      every_votd.each {|vod| vod.references << alternate_votd(Date.today.mday)}
      the_one = every_votd.detect {|votd| votd.day == day}

      # We build these dates assuming that Date.today.year-DOY is always valid.
      # But, if last year was a leap year, then this year will not have a day #366.
      # So, we'll catch the error and subtract 1 from year to build the day #366 VOTD
      # This only happens for the first 25 days of every fourth year (the one after a leap)
      begin
        the_one.date            = Date.strptime("#{Date.today.year}-#{day}","%Y-%j")
        the_one.created_at      = DateTime.strptime("#{Date.today.year}-#{day}","%Y-%j")
      rescue
        the_one.date            = Date.strptime("#{Date.today.year - 1}-#{day}","%Y-%j")
        the_one.created_at      = DateTime.strptime("#{Date.today.year - 1}-#{day}","%Y-%j")
      end

      the_one.week_day        = the_one.date.day
      the_one.version         = Version.find(opts[:version_id])
      the_one.recent_versions = recent_versions(opts[:recent_versions] || [])
      the_one
    end

    def image_for_day(day, size)
      VOD_Image.new(all_images()[day], size)
    end

    def alternate_votd(dayOfMonth, opts={})
      altVerse = ["MAT.18.4","LUK.11.13","JHN.10.11","MAT.24.14","MRK.2.17","JHN.3.3","MAT.16.24","JHN.13.34","MAT.5.44","MAT.5.3","MRK.3.35","MAT.12.50","JHN.8.12","MAT.11.28","LUK.15.7","JHN.11.25","MAT.7.7","LUK.6.35","MRK.16.15","MAT.22.37","LUK.12.28","MAT.13.44","MAT.10.39","MAT.6.21","LUK.19.10","JHN.1.14","MAT.9.38","JHN.6.35","MAT.6.33","MRK.10.45","MAT.24.35"]
      return altVerse[dayOfMonth - 1]
    end

    def third_alternate_votd(dayOfMonth, opts={})
      altVerse = [
        "MAT.18_1.4",
        "LUK.11_1.13",
        "JHN.10_1.11",
        "MAT.24_1.14",
        "MRK.2_1.17",
        "JHN.3_1.3",
        "MAT.16_1.24",
        "JHN.13_1.34",
        "MAT.5_1.44",
        "MAT.5_1.3",
        "MRK.3_1.35",
        "MAT.12_1.50",
        "JHN.8_1.12",
        "MAT.11_1.28",
        "LUK.15_1.7",
        "JHN.11_1.25",
        "MAT.7_1.7",
        "LUK.6_1.35",
        "MRK.16_1.15",
        "MAT.22_1.37",
        "LUK.12_1.28",
        "MAT.13_1.44",
        "MAT.10_1.39",
        "MAT.6_1.21",
        "LUK.19_1.10",
        "JHN.1_1.14",
        "MAT.9_1.38",
        "JHN.6_1.35",
        "MAT.6_1.33",
        "MRK.10_1.45",
        "MAT.24_1.35"
      ]
      return altVerse[dayOfMonth - 1]
    end

    def editable?; false; end
    def deletable?; false; end

    # This is a temporary API that is static JSON hosted on S3
    def all_images()
      vod_image_cache_key = "vod_images"
      curb_get = lambda do
        begin
          curl = Curl::Easy.new
          curl.url = Cfg.vod_image_api_url
          curl.timeout = Cfg.api_default_timeout.to_f
          curl.encoding = ''
          curl.perform
          response = JSON.parse curl.body_str

          # Raise an error here if response code is 400 or greater and the API hasn't sent back a response object.
          # IMPORTANTLY - This avoids us potentially caching a bad API request
          if curl.response_code >= 400 && curl.body_str.nil?
            Raven.capture do
              raise APIError, "API Error: Bad API Response (code: #{curl.response_code}) "
            end
            return JSON_500_General

          end

          # Map Object with keys to match Day of Year
          #  for easier lookups
          mapped_response = {}
          response.each do |img|
            url_parts = img['verse_url'].split('/')
            img['usfm'] = url_parts.pop()
            img['version'] = url_parts.pop()
            mapped_response[img['day']] = img
          end

          return mapped_response

        rescue MultiJson::DecodeError => e
          JSON_500

        rescue Timeout::Error => e
          Raven.capture do
            raise APITimeoutError, log_api_timeout(Cfg.vod_image_api_url,started_at)
          end
          JSON_408

        rescue Curl::Err::TimeoutError => e
          Raven.capture do
            raise APITimeoutError, log_api_timeout(Cfg.vod_image_api_url,started_at)
          end
          JSON_408

        rescue Exception => e
          Raven.capture do
            raise APIError, log_api_error(Cfg.vod_image_api_url,e)
          end
          JSON_500_General

        end
      end

      # try pulling from cache
      Rails.cache.fetch(vod_image_cache_key,expires_in: YV::Caching::a_very_long_time) do
        curb_get.call # cache miss - we need to call to API
      end
    end

    private

    def recent_versions(vids)
      vids.map {|id| Version.find(id)}
    end

    def log_api_error(path,ex)
      "Non-timeout API Error for #{path}: #{ex.class} : #{ex.to_s}"
    end


  end

end
