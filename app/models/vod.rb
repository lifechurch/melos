class VOD < YV::Resource

  class << self


    def all(opts={})
      data, errs = YV::Resource.get("bible/verse_of_the_day", opts.merge(cache_for: YV::Caching.a_very_long_time))
      return data
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



    private

    def recent_versions(vids)
      vids.map {|id| Version.find(id)}
    end

  end

end