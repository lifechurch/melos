# Class to encapsulate the ever expanding task of parsing reference strings
# and pulling out the needed bits of information.

module YouVersion
  class ReferenceString

    attr_accessor :raw, :hash, :verses

    def initialize( ref_str )
      @raw = ref_str
      parse
      return self
    end

    def to_hash
      @hash
    end

    def to_s
      @raw
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
            (?:(?:[:\.])([\w]*))?                             #optional chapter
            \s*
            (?:(?:[:\.]) ([\d\-,\s]*))?                       #optional verse(s)
            \s*
            (?: (?:\.) ((?: \d*\-?)? (?: [\S]*)) )? #optional version
          $/x

      matches = @raw.match(re)
      @hash = {book: matches.try(:[], 1), chapter: matches.try(:[], 2), verses: matches.try(:[], 3), version: matches.try(:[], 4)}
      parse_verses
    end


    def parse_verses
      @verses = []
      return unless @hash[:verses]

      pieces = @hash[:verses].split(",") #split verses at comma. ex: "1-6,7,10"
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

        verses.push(arr)
      end
      @verses = verses.flatten!.map(&:to_i)
    end
  end
end