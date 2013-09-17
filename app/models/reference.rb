# encoding: UTF-8

class Reference < YV::Resource

  attr_reader :book
  attr_reader :chapter
  attr_reader :verses
  attr_reader :version

  # We lazy load API attributes for performance
  # see attributes method and attributes.<attr name> for use.
  # The following lines are just for documentation
  #
  # attribute reference
  # attribute copyright
  # attribute audio

  def initialize(ref="", opts={})
    #sometimes we use reference classes just for data management
    #i.e. we don't always need to hit the API. So we'll lazy load
    #API attributes

    ref_hash = case ref
      
      when /(.{3}\.[^\+]+\.[^\+]+)\+(?:.*)(?:.{3}\..+\.(.+))/ # + separated API string - Reference.new("GEN.15.1+GEN.15.2+GEN.15.3+GEN.15.4+GEN.15.5+GEN.15.6")
        # to be a valid reference, these have to be verses
        # regex selected first usfm and last verse
        YV::ReferenceString.new("#{$1}-#{$2}").to_hash

      when YV::ReferenceString
        ref.to_hash

      when String
        YV::ReferenceString.new(ref).to_hash
      
      when Reference
        ref.to_hash

      when Hash#, Hashie::Mash (is mash creation even used/necessary?)
        ref
          
      else
        {}
    end

    #attempt to convert book and version from legacy OSIS to USFM
    #opts hash acts as overriding value to ref parameter
    _book = opts.has_key?(:book) ? opts[:book] : ref_hash[:book]
      raise InvalidReferenceError, "No book specified." if _book.nil?

    @book = YV::Conversions.usfm_book(_book) || _book
    @book = @book.to_s.upcase

    @chapter = opts.has_key?(:chapter) ? opts[:chapter] : ref_hash[:chapter]
    @chapter = @chapter.to_s.upcase

    _version = opts.has_key?(:version) ? opts[:version] : ref_hash[:version]
    @version = Version.id_from_param(_version)

    _verses = opts.has_key?(:verses) ? opts[:verses] : ref_hash[:verses]
    @verses = parse_verses(_verses)

    unless @book && @chapter
      raise InvalidReferenceError, "Tried to create an invalid reference. (#{ref}, #{opts})
            Make sure you're passing a valid period separated string or hash, with
            at least a book and chapter"
    end
  end

  # Bible text in HTML or plaintext for the current reference instance.
  # This will return entire chapter content for a chapter reference or will return
  # smaller verse content if verses are present

  # Returns a string

  # valid options:
  # - chapter: true
  #   returns bible text for entire chapter

  # - as: (:plaintext)
  #   returns bible text in plain text

  def content(opts={})
    for_chapter = opts[:chapter]
    return attributes.content if for_chapter || is_chapter?

    case opts[:as]
      when :plaintext
        selector = verses.map{|v_num|".v#{v_num} .content"}.join(', ')
        content_document.css(selector).inner_html.strip
      else #:html
        selector = verses.map{|v_num|".v#{v_num}"}.join(', ')
        content_document.css(selector).to_html
    end
  end


  # Human readable version of the reference
  # Ex: 
  #   Genesis 1:2 for GEN.1.2 reference
  #   Genesis 1:2-4 for GEN.1 with verses 2-4

  def human
      return attributes.reference.human.to_s + ":#{verses.first}" if single_verse?
      return attributes.reference.human.to_s if is_chapter?
      # we only support references being consecutive ranges
      # so at this point we can assume it is
      attributes.reference.human.to_s + ":#{verses.first.to_s}" + "-#{verses.last.to_s}"
  end

  # In some legitimate cases, the reference is valid in some versions, but
  # maybe not the current version. In such cases we want to display a "best
  # visual representation" of a USFM value without knowing what the human book
  # should be, because it technically doesn't exist.
  def safe_human
    begin
      human
    rescue NotAChapterError
      usfms = to_usfm.split('+')
      if usfms.length > 1
        # these are reference ranges which should be guaranteed to have verses
        # and be consecutive
        "#{usfms[0]}-#{usfms[-1].split('.')[2]}"
      else
        usfms[0]
      end
    end
  end

  # returns a String for a relative deep link path to be used for app urls.
  # ex: youversion://reference=REF&version_id=VER
  def deep_link_path
    return "bible?reference=#{chapter_usfm}&version_id=#{version}" if version
    return "bible?reference=#{chapter_usfm}"
  end

  # Get a chapter reference (all verses) from current reference
  #
  # example:
  #   reference => Genesis 1:1
  #   reference.to_chapter => Genesis 1
  #
  # returns:
  #   an instance of Reference
  #
  def to_chapter
    self.class.new(self, verses: nil)
  end

  # Return proper usfm format for reference instance
  # Ex: GEN.3.4 for Genesis 3:4

  def to_usfm
    return "#{chapter_usfm}" if is_chapter?
    return verses.map {|v| "#{chapter_usfm}.#{v}"}.join(YV::Conversions.usfm_delimeter)
  end

  def usfm
    to_usfm
  end

  # String representation of a reference, human readable
  def to_s(opts={})
    return human                          if opts[:version] == false
    return "#{human} (#{version_string})" if version
    return human
  end

  # A usfm representation scoped to just book / chapter for a reference
  # Ex: GEN.3 for Genesis 3 | Genesis 3:1
  # returns a string
  def chapter_usfm
    #memoizing because of chapter_list indexing
    @chapter_usfm ||= "#{book}.#{chapter}"
  end

  # A string format for the reference Version
  # Ex: "KJV" if version id = 1
  # returns a string
  def version_string
    Version.find(version).human if version
  end

  def to_param
    _ref = "#{to_usfm}" if is_chapter? || single_verse?
    _ref ||= "#{chapter_usfm}.#{verses.first}-#{verses.last}"
    _ver = ".#{Version.find(version).abbreviation}" if version
    "#{_ref}#{_ver}".downcase
  end

  def [](arg)
    return self.try(arg.to_sym)
  end

  # A hash of usfm+version string
  # Used for comparison purposes
  def hash
    #not using to_param so we don't have to hit the API to compare References
    "#{to_usfm}+#{version}".hash
  end

  def ==(compare)
    #if same class
    (compare.class == self.class) &&  compare.hash == hash
  end

  def eql?(compare)
    self == compare
  end

  def notes
    @notes ||= Note.for_reference(self)
  end

  def merge(hash)
    Reference.new(to_hash.merge(hash))
  end

  def single_verse?
    verses.count == 1 rescue false
  end

  def short_link
    "http://bible.com/#{version}/#{self.to_param.sub(/\./, "")}"
  end

  def copyright
    self.class.i18nize(attributes.copyright) if version
  end


  # API Method
  # returns extra audio information for a refernce
  # we have to make this additional call to get the audio bible copyright info

  # TODO: make sure on front end we are ajaxing this information if at all possible
  #       really shouldn't need to make another api call here, but its necessary given data limitations

  # example data prior calling method:
  # {"id"=>8,
  #  "version_id"=>1,
  #  "title"=>"KJV Listener's Bible",
  #  "download_urls"=>
  #  {"format_mp3_32k"=>
  #    "//static-youversionapi-com.commondatastorage.googleapis.com/bible/audio/8/32k/GEN/1-b5969203ff27ab059b850b2210ae90b7.mp3?version_id=1"}}


  # Example data following method call:
  # {"id"=>8,
  #  "version_id"=>1,
  #  "title"=>"KJV Listener's Bible",
  #  "download_urls"=>
  #   {"format_mp3_32k"=>
  #     "//static-youversionapi-com.commondatastorage.googleapis.com/bible/audio/8/32k/GEN/1-b5969203ff27ab059b850b2210ae90b7.mp3?version_id=1"},
  #  "copyright_short"=>
  #   {"text"=>"Copyright 2007 Fellowship for the Performing Arts",
  #    "html"=>"Copyright 2007 Fellowship for the Performing Arts"},
  #  "copyright_long"=>
  #   {"text"=>
  #     "Experience the majestic language of the King James Bible skillfully narrated Through the powerful voice of Max McLean. The King James Bible (KJV) was written with oral interpretation in mind, making the grandeur of its phrasing and the rich musicality of its rhythms resonate in the ear and mind of the listener.\\r\\n\\r\\nThis audio Bible is provided by The Listener's Audio Bible (c) 2007 All rights reserved. A Ministry of Fellowship for the Performing Arts The Holy Bible, King James Version. Recorded under licensing agreement. (http://www.listenersbible.com)",
  #    "html"=>
  #     "Experience the majestic language of the King James Bible skillfully narrated Through the powerful voice of Max McLean. The King James Bible (KJV) was written with oral interpretation in mind, making the grandeur of its phrasing and the rich musicality of its rhythms resonate in the ear and mind of the listener.\\r\\n\\r\\nThis audio Bible is provided by The Listener's Audio Bible (c) 2007 All rights reserved. A Ministry of Fellowship for the Performing Arts The Holy Bible, King James Version. Recorded under licensing agreement. (<a href=\"http://www.listenersbible.com\">http://www.listenersbible.com</a>)"},
  #  "publisher_link"=>"http://www.listenersbible.com/free-download",
  #  "url"=>
  #   "//static-youversionapi-com.commondatastorage.googleapis.com/bible/audio/8/32k/GEN/1-b5969203ff27ab059b850b2210ae90b7.mp3?version_id=1"}

  # TODO: Move this to it's own Object/Model


  def audio
    return @audio unless @audio.nil?
    return nil if attributes.audio.nil?

    opts = {id: attributes.audio[0].id, cache_for: YV::Caching.a_very_long_time}

    
    data, errs = self.class.get("audio-bible/view", opts)
    results = YV::API::Results.new(data,errs)
    unless results.valid?
      raise_errors(results.errors, "reference#audio")
    end

    @audio     = attributes.audio[0].merge(data)
    @audio.url = attributes.audio[0].download_urls.format_mp3_32k
    return @audio
  end

  def previous_chapter
    return nil unless version
    return nil if attributes.previous.blank?

    self.class.new(attributes.previous.usfm, version: version)
  end

  def next_chapter
    return nil unless version
    return nil if attributes.next.blank?

    self.class.new(attributes.next.usfm, version: version)
  end

  def is_chapter?
    @is_chapter ||= (verses.empty? || false)
  end

  #HACK: looking for "intro" is not a great way to check if a chapter is
  #actually an intro, but it will do for now
  def is_intro?
    !self.usfm.match(/\.intro/i).nil?
  end

  def valid?
    return content != ""
  end

  def osis
    Rails.logger.apc "#{self.class}##{__method__} is deprecated,use the 'to_param' or 'to_usfm' methods instead", :debug
    to_param
  end

  def to_hash
    {book: book, chapter: chapter, verses: verses, version: version}
  end



 private

  def content_document
    @content_document ||= Nokogiri::HTML(attributes.content)
    #TODO: #PERF: cache this with memcache if we keep and use it
  end

  # API Method
  # retrieve api details for a reference.  attributes are lazy loaded
  def attributes
    return @attributes unless @attributes.nil?

    validate

    # sometimes we just need generic info about a verse, like the human spelling of a chapter
    # in this rare case, we will just use the YouVersion default Version

    # we will always just get the chapter, and parse down to verses if needed
    # this will utilize server side cache more effectively
    # as the alternative (for multiple verses) is multiple bible/verse calls

    opts = {
      id: version || Version.default,
      reference: chapter_usfm,
      cache_for: YV::Caching.a_very_long_time,
    }

    data, errs = self.class.get("bible/chapter", opts)
    results = YV::API::Results.new(data,errs)

    unless results.valid?
      raise_errors(results.errors, "reference#attributes")
    end
    @attributes = data
  end


  def validate
    # check book, chapter and version against data we have in Version object
    # to avoid 404 calls to the API (DDoS avoidance and performance advantage)

    _version = (version.blank?) ? Version.find(Version.default) : Version.find(version)

    raise NotAChapterError unless _version.include? self
  end

  def parse_verses(verses)
    # This method should not hit the API
    # for lazy-loading to work
    if verses.nil? then @is_chapter = true and return [] end
    return YV::ReferenceString.parse_verses(verses).map(&:to_s)
  end

end
