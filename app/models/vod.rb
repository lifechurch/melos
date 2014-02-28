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
      super(opts)
    end

    def day(day,opts={})
      every_votd = all(opts)

      the_one = every_votd.detect {|votd| votd.day == day}
      the_one.date            = Date.strptime("#{Date.today.year}-#{day}","%Y-%j")
      the_one.created_at      = DateTime.strptime("#{Date.today.year}-#{day}","%Y-%j")
      the_one.week_day        = the_one.date.day
      the_one.version         = Version.find(opts[:version_id])
      the_one.recent_versions = recent_versions(opts[:recent_versions] || [])
      the_one
    end

    def editable?; false; end
    def deletable?; false; end

    private

    def recent_versions(vids)
      vids.map {|id| Version.find(id)}
    end

  end

end