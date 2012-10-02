
# encoding: UTF-8
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
    when /(.{3}\.[^\+]+\.[^\+]+)\+(?:.*)(?:.{3}\..+\.(.+))/ # + separated API string
      # to be a valid reference, these have to be verses
      # regex selected first usfm and last verse
      YvApi::parse_reference_string "#{$1}-#{$2}"
    when String
      YvApi::parse_reference_string ref
    when Hash#, Hashie::Mash (is mash creation even used/necessary?)
      ref
    when Reference
      ref.to_hash
    else
      {}
    end

    #attempt to convert book and version from legacy OSIS to USFM
    #opts hash acts as overriding value to ref parameter
    _book = opts.has_key?(:book) ? opts[:book] : ref_hash.try(:[], :book)
    @book = YvApi::get_usfm_book(_book) || _book
    @book = @book.try :upcase

    @chapter = opts.has_key?(:chapter) ? opts[:chapter] : ref_hash.try(:[], :chapter)

    _version = opts.has_key?(:version) ? opts[:version] : ref_hash.try(:[], :version)
    @version = Version.id_from_param(_version)

    #we evaluate verses last, as it may hit the API
    @verses = opts.has_key?(:verses) ? opts[:verses] : ref_hash.try(:[], :verses)
    @verses = parse_verses(@verses)

    unless @book && @chapter
      raise InvalidReferenceError, "Tried to create an invalid reference. (#{ref}, #{opts})
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
      return attributes.reference.human.to_s + ":#{verses.first}" if single_verse?
      return attributes.reference.human.to_s if is_chapter?
      # we only support references being consecutive ranges
      # so at this point we can assume it is
      attributes.reference.human.to_s + ":#{verses.first.to_s}" + "-#{verses.last.to_s}"
  end

  def to_param
    return "#{to_usfm}.#{Version.find(version).abbreviation}".downcase if version
    to_usfm.downcase
  end

  def version_string
    Version.find(version).human if version
  end

  def to_usfm
      return "#{chapter_usfm}" if is_chapter?
      return verses.map {|v| "#{chapter_usfm}.#{v}"}.join(YvApi::usfm_delimeter) if verses
  end

  def usfm
    to_usfm
  end

  def chapter_usfm
    #memoizing because of chapter_list indexing
    @chapter_usfm ||= "#{book}.#{chapter}"
  end

  def [](arg)
    return self.try(arg.to_sym)
  end

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
    Note.for_reference(self)
  end

  def merge(hash)
    Reference.new(to_hash.merge(hash))
  end

  def single_verse?
    verses.count == 1
  end

  def short_link
    "http://bible.us/#{version}/#{self.to_param.sub(/\./, "")}"
  end

  def content(opts={})
    return attributes.content if is_chapter?

    case opts[:as]
      when :plaintext
        selector = verses.map{|v_num|".v#{v_num} .content"}.join(', ')
        content_document.css(selector).inner_html
      else #:html
        selector = verses.map{|v_num|".v#{v_num}"}.join(', ')
        content_document.css(selector).to_html
    end
  end

  def copyright
    attributes.copyright.html || attributes.copyright.text if version
  end

  def audio
    return @audio unless @audio.nil?
    return nil if attributes.audio.nil?

    opts = {id: attributes.audio[0].id, cache_for: a_very_long_time}

    #we have to make this additional call to get the audio bible copyright info
    response = YvApi.get("audio-bible/view", opts) do |errors|
        raise YouVersion::ResourceError.new(errors)
    end
    @audio = attributes.audio[0].merge(response)
    @audio.url = attributes.audio[0].download_urls.format_mp3_32k
    @audio
  end

  def previous_chapter
     return nil unless version

     start = Time.now.to_f
    #no previous chapter if at start
    return nil if chapter_list_index == 0
    Rails.logger.apc "**Reference.previous_chapter took #{Time.now.to_f - start} sec to find the chapter", :debug

    self.class.new(chapter_list[chapter_list_index - 1].usfm, version: version)
  end

  def next_chapter
    return nil unless version

    start = Time.now.to_f
    return nil if chapter_list_index >= chapter_list.count - 1
    Rails.logger.apc "**Reference.next_chapter took #{Time.now.to_f - start} sec to find the chapter", :debug

    self.class.new(chapter_list[chapter_list_index + 1].usfm, version: version)
  end

  def verses_in_chapter
    return @verses_in_chapter unless @verses_in_chapter.nil?

    start = Time.now.to_f
    # it takes about the same amount of time to parse the html as a document
    # as it does to run a regular expression on it. Since we may need multiple
    # queries, we might as well create and cache the DOM-style document tree
    @verses_in_chapter = content_document.css(".verse > .label").map{|node| node.inner_html}
    Rails.logger.apc "** Reference.verses_in_chapter: It took #{Time.now.to_f - start} seconds to scan the content", :debug
    @verses_in_chapter
  end

  def implicit_verses
    # we need this as separate from #verses, so #verses can stay cheap
    # giving us lazy-loading capability
    is_chapter? ? verses_in_chapter : verses
  end

  def is_chapter?
    @is_chapter || verses.empty? || false
  end

  def valid?
    attributes.reference.human.is_a?(String) rescue false
  end

  def notes_api_string
      return implicit_verses.map {|verse| "#{chapter_usfm}.#{verse}" }.join("+")
  end

  def plan_api_string
    notes_api_string.capitalize
  end

  def osis
    Rails.logger.apc "#{self.class}##{__method__} is deprecated,use the 'to_param' or 'to_usfm' methods instead", :debug
    to_param
  end

  def osis_noversion
    Rails.logger.apc "#{self.class}##{__method__} is deprecated, use the 'to_param' or 'to_usfm' methods instead", :debug
    to_usfm
  end

  def osis_book_chapter
    Rails.logger.apc "#{self.class}##{__method__} is deprecated, use the 'to_param' or 'to_usfm' methods instead", :debug
    chapter_usfm
  end

  def to_osis_string
    Rails.logger.apc "#{self.class}##{__method__} is deprecated, use the 'to_param' or 'to_usfm' methods instead", :debug
    to_param
  end

  def to_hash
    {book: book, chapter: chapter, verses: verses, version: version}
  end





  #DEBUGprivate

  def attributes
    return @attributes unless @attributes.nil?

    opts = {cache_for: a_very_long_time}
    # sometimes we just need generic info about a verse, like the human spelling of a chapter
    # in this rare case, we will just use the YouVersion default Version
    opts[:id] =  version || Version.default.id
    # we will always just get the chapter, and parse down to verses if needed
    # this will utilize server side cache more effectively
    # as the alternative (for multiple verses) is multiple bible/verse calls
    opts[:reference] = chapter_usfm

      @attributes = YvApi.get("bible/chapter", opts) do |errors|
        if errors.length == 1 && [/^bible.reference.not_found$/].detect { |r| r.match(errors.first["key"]) }
          raise NotAChapterError
        elsif errors.length == 1 && [/^bible.id.not_found$/].detect { |r| r.match(errors.first["key"]) }
          raise NotAVersionError
        end
      end
  end

  def parse_verses(verses)
    # This method should not hit the API
    # for lazy-loading to work
    case verses
    when NilClass
      @is_chapter = true
      #eventually API will return verses and we won't need to parse this
      []
    when Fixnum
      [verses]
    when /^\d+$/
      [verses.to_s]
    when /^(\d+)\-(\d+)/
      Range.new($1, $2).map{|i| i.to_s}
    when Array
      @is_chapter = true if verses.empty?
      verses
    when String
      verses
    else
      []
    end
  end

  def chapter_list_index
    @index ||= chapter_list.index{|c| c.usfm == chapter_usfm}
  end

  def chapter_list
    @chapter_list ||= Version.find(version).books.map{|usfm, book| book["chapters"]}.flatten
  end

  def content_document
    @content_document ||= Nokogiri::HTML(attributes.content)
    #TODO: #PERF: cache this with memcache if we keep and use it
  end
end