class Reference
  extend ActiveModel::Naming
  include ActiveModel::Conversion

  def initialize(ref, version = nil)
    @api_data = {}
    case ref
    when String
      @ref = ref.to_osis_hash
    when Hashie::Mash
      @ref = ref.osis.to_osis_hash
      @human = ref.human
    when Hash
      @ref = ref
    end

    # Only user version param if 'ref' didn't include version info
    @ref[:version] ||= version

    # raise "Tried to create an invalid reference. Make sure you're passing an OSIS string or hash with at least a book name, chapter, and version." unless (@ref[:book] && @ref[:chapter] && @ref[:version])
  end

  def raw_hash
    @ref
  end

  def short_link
    "http://bible.us/#{@ref.to_osis_string.sub(/\./, "")}"
  end

  def to_s
    @string = self.ref_string
    @string += " (#{self.version_string})" if @ref[:version]
    @string
  end
  
  def hash
    osis.hash
  end
  
  def ==(compare)
    #if same class
    (compare.class == self.class) &&  compare.hash == hash
  end

  def eql?(compare)
    self == compare
  end

  def ref_string
    case @ref[:verse]
    when Fixnum
      @human ||= api_data.items[0].data.reference.human.to_s
    when Range
      @human ||= api_data.items[0].data.reference.human.to_s + "-#{@ref[:verse].last.to_s}"
    when NilClass
      # it's a chapter only; use the chapter API data
      @human ||= api_data[0].data.request.reference.human.to_s
    end
  end

  def version_string
    @version_string ||= @ref[:version].upcase.match(/\A[^-]*/)
  end

  def version
    @ref[:version]
  end

  def notes_api_string
    case @ref[:verse]
    when Fixnum
      return @ref.except(:version).to_osis_string
    when Range
      return @ref[:verse].map { |r| "#{@ref[:book]}.#{@ref[:chapter]}.#{r}" }.join("+")
    when NilClass
      chapters = Version.find(@ref[:version]).books[@ref[:book]].chapter[@ref[:chapter]].verses
      return (1..chapters).map {|r| "#{@ref[:book]}.#{@ref[:chapter]}.#{r}" }.join("+")
    end
  end
  
  def plan_api_string
    notes_api_string.capitalize
  end

  def notes
    Note.for_reference(self)
  end
  
  def merge(hash)
    Reference.new(@ref.merge(hash))
  end

  def merge!(hash)
    @ref.merge!(hash)
    return self
  end

  def [](arg)
    @ref[arg]
  end

  def to_param
    osis
  end

  def contents(opts={})
    @contents ||= parse_contents(opts)
  end

  def copyright
    @copyright ||= @ref[:verse] ? api_data.copyright : api_data[0].data.copyright
    return nil if @copyright.blank?
    @copyright
  end
  
  def audio
    if api_data[0].data.request.audio && @audio.nil?
      # {"id"=>"8",
      #   "version"=>"kjv",
      #   "title"=>"KJV Listener's Bible",
      #   "copyright"=>"Copyright 2007 Fellowship for the Performing Arts",
      #   "description_text"=> "Experience the majestic language of the King James Bible skillfully narrated...
      #   "description_html"=> ...of the listener.\\r\\n\\r\\nThis audio Bible is provided.... Recorded under licensing agreement. (<a href=\"http://www.listenersbible.com\">http://www.listenersbible.com<?a>)",
      #   "publisher_link"=>"http://www.listenersbible.com/free-download"}
      opts = {id: api_data[0].data.request.audio[0].id}
      
      response = YvApi.get("audio_bible/view", opts) do |errors|
          raise YouVersion::ResourceError.new(errors)
      end
      @audio = Hashie::Mash.new({url: api_data[0].data.request.audio[0].download_urls.format_mp3_32k}).merge(response)
    end
    @audio
  end

  def osis
    @ref.to_osis_string
  end

  def osis_noversion
    @ref.to_osis_string_noversion
  end
  
  def osis_book_chapter
    @ref.to_osis_string_book_chapter
  end

  def previous
    return nil if api_data[0].data.previous.blank?
    @previous ||= Reference.new("#{api_data[0].data.previous.reference.osis}.#{@ref[:version]}")
  end
  def next
    return nil if api_data[0].data.next.blank?
    @next ||= Reference.new("#{api_data[0].data.next.reference.osis}.#{@ref[:version]}")
  end

  def to_api

  end

  def human

  end

  def first_verse
    verses = raw_hash[:verse]
    case verses
    when Range
      verses.first
    when Fixnum
      verses
    end
  end

  def verse_string
    
    @ref[:verse].is_a?(Range) ? @ref[:verse].first.to_s + "-" + @ref[:verse].last.to_s : @ref[:verse].to_s if @ref[:verse]
  end
  private

  def api_data(opts ={})
    api_type = @ref[:verse] ? 'verse' : 'chapter'
    format = api_type == 'verse' ? 'text' : 'html'
    format = opts[:format] if (opts[:format] == 'text' || opts[:format] == 'html')
    format = 'html_basic' if (format == 'html' && api_type == 'verse')
    #TODO: this is dirty for now, clean up once we understand the use cases for differently formatted text
    
    #get new data if the format is the same
    if(@api_data[:format].nil? || @api_data_format != format)
      @api_data[:format] = YvApi.get("bible/#{api_type}",
                                        format: format,
                                        version: @ref[:version],
                                        reference: @ref.except(:version).to_osis_string,
                                        cache_for: 30.minutes)
      @api_data_format = format
    end
    
    @api_data[:format]
  end

  def parse_contents(opts={})
    if @ref[:verse]
      # then it's a verse range; use the verse style
      api_data(opts).items.map { |a| a.data.content }
    else
      # It's a chapter
      [api_data(opts)[0].data.request.content]
    end
  end
end
