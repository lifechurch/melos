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
    def today(version_id = 1)
      today = Date.today.yday
      item = all.detect {|d| d.day == today} # {"references"=>["PHP.3.13+PHP.3.14"], "day"=>315}
      
      # join multiple items in array, then split on our + to get all reference pieces
      references    = item.references.join("+").split("+")  # ["PHP.3.13","PHP.3.14"]
      verse_nums    = references.collect {|ref| ref.split(".").last} # get 13 from PHP.3.13 for each ref occurence
      pieces        = references.first.split(".")
      usfm_chapter  = pieces.first + "." + pieces.second # "PHP.3"


      opts = { id: version_id, reference: usfm_chapter }
      data, errs = get("bible/chapter", opts)
      results = YV::API::Results.new(data,errs)

      selector = verse_nums.map{|v_num|".v#{v_num} .content"}.join(', ')
      document = Nokogiri::HTML(results.content)
      verse_text = document.css(selector).inner_html.strip

      data = {
        version: Version.find(version_id),
        human: results.reference.human + ":" + verse_nums.join(", "),
        usfm: results.reference.usfm,
        verses: verse_nums,
        content: verse_text,
        week_day: Date.today.day,
        day: item.day

      }
      Hashie::Mash.new(data)
    end


  end

end