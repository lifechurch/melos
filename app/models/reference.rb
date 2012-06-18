class Reference < YouVersion::Resource

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
    when String
      YvApi::parse_reference_string ref
    when Hash
      ref
    else
      {}
    end

    #attempt to convert book and version from legacy OSIS to USFM
    _book = ref_hash.try(:[], :book) || opts[:book]
    @book = YvApi::get_usfm_book(_book) || _book
    @book = @book.try :upcase
    @chapter = ref_hash.try :[], :chapter || opts[:chapter]
    @chapter = @chapter.to_i if @chapter
    @verses = ref_hash.try :[], :verses || opts[:verse] || opts[:verses]
    @verses = parse_verses(@verses)
    _version = ref_hash.try(:[], :version) || opts[:version]
    @version = YvApi::get_usfm_version(_version) || _version

    unless @book && @chapter
      raise InvalidReferenceError, "Tried to create an invalid reference.
            Make sure you're passing a valid period separated string or hash, with
            at least a book and chapter"
    end
  end

  def to_s(opts={})
    return human if opts[:version] == false
    return "#{human} (#{version_string})" if version
    return human
  end

   def human
    case verses
    when Fixnum
      attributes.reference.human.to_s + ":#{verses}"
    when Range
      attributes.reference.human.to_s + ":#{verses.first.to_s}" + "-#{verses.last.to_s}"
    when NilClass
      # it's a chapter only
      attributes.reference.human.to_s
    end
  end

  def to_param
    return "#{to_usfm}.#{Version.find(version).to_param}" if version
    return to_usfm
  end

  def version_string
    Version.find(version).human if version
  end

  def to_usfm
      return "#{chapter_usfm}" unless verses
      return "#{chapter_usfm}.#{verses}" if single_verse?
      return verses.map {|v| "#{chapter_usfm}.#{v}"}.join(YvApi::usfm_delimeter) if verses
  end

  def chapter_usfm
    "#{book}.#{chapter}"
  end

  def [](arg)
    return self.try(arg.to_sym)
  end

    def hash
    to_usfm.hash
  end

  def ==(compare)
    #if same class
    (compare.class == self.class) &&  compare.hash == hash
  end

  def eql?(compare)
    self == compare
  end

  def notes
    Note.for_reference(self)
  end

  def merge(hash)
    Reference.new(to_hash.merge(hash))
  end

  def single_verse?
    verses.is_a? Fixnum
  end

  def short_link
    "http://bible.us/#{self.to_param.sub(/\./, "")}"
  end

  def content(opts={})
    attributes.content if version
  end

  def copyright
    attributes.copyright.html || attributes.copyright.text if version
  end

  def audio
    #DEBUG return @audio unless @audio.nil?
    return nil if attributes.audio.nil?

    opts = {id: attributes.audio[0].id, cache_for: 12.hours}

    #we have to make this additional call to get the audio bible copyright info
    @audio = YvApi.get("audio-bible/view", opts) do |errors|
        raise YouVersion::ResourceError.new(errors)
    end
  end

  def previous
    version.previous_chapter if version
  end

  def next
    version.next_chapter if version
  end

  def first_verse
    case verses
      when Range
        verses.first
      when Fixnum
        verses
      when NilClass
        nil
    end
  end

  def verses_in_chapter
    return @verses_in_chapter unless @verses_in_chapter.nil?

    start = Time.now.to_f
    # regex = /
    #           (?:
    #             <[^>]*                          # a tag
    #             class=                          # with a class attribute
    #               [^>]*\"                       # defined within the tag
    #               [^\"]*                        # with possibly some other classes in the same attribute
    #               verse_content                 # has the verse_content class
    #               [^\"]*                        # with possibly some other classes in the same attribute
    #               (REF_#{book}_#{chapter}_\d+)  # and has a verse class
    #           )
    #         /x

    # # there may be multiple verse spans per verse (inline notes, etc)
    # # so we count unique verse classes
    # @verses_in_chapter = attributes.content.scan(regex).uniq!.size

    # it takes about the same amount of time to parse the html as a document
    # as it does to run a regular expression on it. Since we may need multiple
    # queries, we might as well create and cache the document
    @verses_in_chapter = content_document.css(".verse_label").count
    Rails.logger.apc "** Reference.verses_in_chapter: It took #{Time.now.to_f - start} seconds to scan the content", :debug
    @verses_in_chapter
  end

  def is_chapter?
    verses.nil?
  end

  def valid?
    attributes.reference.human.is_a?(String) rescue false
  end

  def verse_string
    case verses
      when Range
        verses.first.to_s + "-" + verses.last.to_s
      when Fixnum
        verses.to_s
    end
  end

  def verses_string
    # for reader: turns 3,4,8-12 to 3,4,8,9,10,11,12
    case verses
    when Fixnum
      @verses = verses.to_s
    when Range
      @verses = verses.to_a.join(",")
    when String
      @verses = verses.split(",").map do |r|
        case r
        when /^[0-9]+$/
          r
        when /^[0-9-]+$/
          ((r.split("-")[0])..(r.split("-")[1])).to_a.join(",")
        end
      end.flatten.join(",")
      @verses
    end
  end

  def notes_api_string
    case verses
    when Fixnum
      return to_usfm
    when Range
      return to_usfm
    when NilClass
      return (1..verses_in_chapter).map {|r| "#{book}.#{chapter}.#{r}" }.join("+")
    end
  end

  def plan_api_string
    notes_api_string.capitalize
  end

  def osis
    Rails.logger.apc "#{self.class}##{__method__} is deprecated,use the 'to_param' or 'to_usfm' methods instead", :warn
    to_hash.to_osis_string
  end

  def osis_noversion
    Rails.logger.apc "#{self.class}##{__method__} is deprecated, use the 'to_param' or 'to_usfm' methods instead", :warn
    to_hash.to_osis_string_noversion
  end

  def osis_book_chapter
    Rails.logger.apc "#{self.class}##{__method__} is deprecated, use the 'to_param' or 'to_usfm' methods instead", :warn
    to_hash.to_osis_string_book_chapter
  end

  def to_osis_string
    Rails.logger.apc "#{self.class}##{__method__} is deprecated, use the 'to_param' or 'to_usfm' methods instead", :warn
    to_hash.to_osis_string
  end

  def to_hash
    Rails.logger.apc "#{self.class}##{__method__} is deprecated, use the [] method or attr_reader methods instead", :warn
    #here for transition to API3, replacing raw_hash until not needed
    {book: book, chapter: chapter, verses: verses, version: version}
  end





  #DEBUGprivate

  def attributes
    #DEBUGreturn @attributes unless @attributes.nil?

    opts = {cache_for: 12.hours}
    # sometimes we just need generic info about a verse, like the human spelling of a chapter
    # in this rare case, we will just use the YouVersion default Version
    opts[:id] =  version || Version.default
    # we will always just get the chapter, and parse down to verses if needed
    # this will utilize server side cache more effectively
    # as the alternative (for multiple verses) is multiple bible/verse calls
    opts[:reference] = chapter_usfm

      @attributes = YvApi.get("bible/chapter", opts) do |errors|
        if errors.length == 1 && [/^Reference not found$/].detect { |r| r.match(errors.first["error"]) }
          raise NotAChapterError
        elsif errors.length == 1 && [/^Version is invalid$/].detect { |r| r.match(errors.first["error"]) }
          raise NotAVersionError
        elsif errors.length == 1 && [/Invalid chapter reference$/].detect { |r| r.match(errors.first["error"]) }
          raise NotABookError
        end
      end
  end

  def parse_verses(verses_str)
    case verses_str
    when Fixnum
      verses_str
    when /^\d+$/
      verses_str.to_i
    when /^(\d+)\-(\d+)/
      Range.new($1, $2)
    else
      verses_str
    end
  end

  def content_document
    @content_document ||= Nokogiri::HTML(attributes.content)
    #TODO: #PERF: cache this if we keep and use it
  end
end
