class VOD < YV::Resource

  include YV::Concerns::Moments

  attributes [:references,:version,:recent_versions,:day,:week_day,:date,:created_dt]
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
      the_one.week_day        = the_one.date.day
      the_one.version         = Version.find(opts[:version_id])
      the_one.recent_versions = recent_versions(opts[:recent_versions] || [])
      the_one
    end


    # Solid assumptions that can be made as discussed with Adam
    # Verse of the day:
    # - will always be in same book
    # - will always be in same chapter
    # - will always have continuous verses if there is more than one verse
    def today(version_id = 1, opts= {})
      today = Date.today
      yday  = today.yday
      item = all.detect {|d| d.day == yday} # {"references"=>["PHP.3.13+PHP.3.14"], "day"=>315}
      item = all.detect {|d| d.day == yday-1} if item.nil? # fallback if there is no day, there HAS to be a yesterday...right??

      # join multiple items in array, then split on our + to get all reference pieces
      references    = item.references.join("+").split("+")  # ["PHP.3.13","PHP.3.14"]
      verse_nums    = references.collect {|ref| ref.split(".").last} # get 13 from PHP.3.13 for each ref occurence
      pieces        = references.first.split(".")
      usfm_chapter  = pieces.first + "." + pieces.second # "PHP.3"


      request_opts = { id: version_id, reference: usfm_chapter }
      data, errs = get("bible/chapter", request_opts)
      results = YV::API::Results.new(data,errs)

      selector = verse_nums.map{|v_num|".v#{v_num} .content"}.join(', ')
      document = Nokogiri::HTML(results.content)
      verse_text = document.css(selector).inner_html.strip

      data = {
        version:  Version.find(version_id),
        human:    results.reference.human + ":" + verse_nums.join(", "),
        usfm:     results.reference.usfm.first,
        verses:   verse_nums,
        content:  verse_text,
        week_day: today.day,
        day:      item.day,
        date:     Date.strptime("#{today.year}-#{today.yday}","%Y-%j"),
        recent_versions: recent_versions(opts[:recent_versions] || [])
      }
      Hashie::Mash.new(data)
    end

    def editable?; false; end
    def deletable?; false; end

    private

    def recent_versions(vids)
      vids.map {|id| Version.find(id)}
    end

  end

end