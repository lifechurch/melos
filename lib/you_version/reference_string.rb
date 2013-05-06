# Class to encapsulate the ever expanding task of parsing reference strings
# and pulling out the needed bits of information.

module YouVersion
  class ReferenceString

    attr_accessor :hash, :verses
    attr_reader :raw, :defaults

    def initialize( ref_str, opts={})
      @raw        = ref_str
      @validated  = false
      @defaults   = opts[:defaults]   || {}
      @overrides  = opts[:overrides]  || {}
      parse
      return self
    end

    def to_hash
      @hash
    end

    def to_s
      @raw
    end

    def book
      @hash[:book]
    end

    def chapter
      @hash[:chapter]
    end

    #verses is attr_accessor
    def hash=(value)
      @validated = false
      @hash = value
    end

    def version
      @hash[:version]
    end

    def validated?
      @validated
    end

    def validate!
      return self if @validated
      # checks to see if the string is as valid as we can check without hitting API
      # If it is deemed valid, it replaces the book and version elements
      # to be valid USFM and API3 codes/ids.
      if book.is_a? String
        # leave it if it's already a USFM code
        _book = book if Cfg.osis_usfm_hash[:books].key(book.upcase)
        # try to parse from known values
        _book ||= Cfg.osis_usfm_hash[:books][@hash[:book].downcase]
        return nil if _book.blank?
      else
        # no book specified, invalid
        return nil
      end

      # need to have a chapter
      return nil if chapter.blank?

      # if there is a version it needs to be API3 id or match our known versions
      if version.present?
        # leave it if it's already an API3 id (positive #)
        _ver = version if version.is_a?(Fixnum) || (version.match(/\A\d*\z/)&& version.to_i > 0)
        # try to parse from known values
        _ver ||= Cfg.osis_usfm_hash[:versions][version.downcase] if version.is_a? String
        return nil if _ver.blank?
      end

      @hash[:book] = _book.upcase
      @hash[:version] = _ver
      @validated = true
      return self
    end

    def [](arg)
      return @hash.try(:[], arg.to_sym)
    end

    private

    def parse
      re =  /^
            \s*
            ([1-3]? \s* [A-Za-z0-9]+)                         #book
            \s*
            (?:(?:[\s:\.])([\w]*))?                             #optional chapter
            \s*
            (?:(?:[\s:\.]) ([\d\-,\s]*))?                       #optional verse(s)
            \s*
            (?: (?:[\s\.]) ((?: \d*\-?)? (?: [\S]*)) )? #optional version
          $/x

      matches = @raw.match(re)
      @hash = {book: matches.try(:[], 1), chapter: matches.try(:[], 2), verses: matches.try(:[], 3), version: @overrides[:version] || matches.try(:[], 4) || defaults[:version]}
      parse_verses
    end


    # Class utility method for parsing verse strings returning an array of verse numbers found in the string
    #
    # Example verse strings:
    # - "1-6,7,10"  => [1,2,3,4,5,6,7,10]
    # - "1"         => [1]
    # - "1,4"       => [1,4]
    # - "1-5"       => [1,2,3,4,5]

    def self.parse_verses( verses )
      vs = []
      pieces = verses.split(",")
      pieces.each do |piece|

        arr = case piece
          when NilClass
            []
          when Fixnum
            [piece]
          when /^\d+$/
            [piece]
          when /^(\d+)\-(\d+)/
            Range.new($1, $2).to_a
          when Array
            piece
          when String
            [piece]
        else
          []
        end

        vs.push(arr)
      end
      return vs.flatten.map(&:to_i)
    end


    def parse_verses

      @verses = []
      return unless @hash[:verses]
      @verses = YouVersion::ReferenceString.parse_verses(@hash[:verses])
    end
  end
end