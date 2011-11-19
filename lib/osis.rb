class String
  # The OSIS string format used at YouVersion is "[book].[chapter or chapter range].[opt. verse or verse range].[opt. version]"
  def parse_osis_format
    items = self.downcase.split(".")
    hash = {book: items.first}
    case items.length
    when 2
      items[1].match(/^[0-9]+$/) ? hash[:chapter] = items[1].to_i : hash[:version] = items[1]
    when 3
      chapters = items[1].split("-")
      hash[:chapter] = chapters.length == 1 ? chapters.first.to_i : (chapters[0].to_i..chapters[1].to_i)
      verses = items[2].split("-")
      if verses.length > 1
        hash[:verse] = (verses[0].to_i..verses[1].to_i)
      else
        items[2].match(/^[0-9]+$/) ? hash[:verse] = items[2].to_i : hash[:version] = items[2]
      end
    when 4
      hash[:chapter] = items[1].to_i
      hash[:version] = items[3]
      verses = items[2].split("-")
      hash[:verse] = verses.length == 1 ? verses.first.to_i : (verses[0].to_i..verses[1].to_i)
    end
    return hash
  end

  # Lemme 'splain the pattern here. Most people I know are accustomed to writing Bible references
  # as "Gen 1:1" or "Leviticus 20:1-2". So this patterns matches and captures 4 parts:
  #   - book name
  #   - chapter
  #   - verse or verses
  #   - version
  # Book name and chapter are expected; verses and version are optional. Pattern works this way:
  #   book - leading 1, 2, or 3 are OK, then any series of letters: 1 john, 2 Kings, Exodus, Mat, etc.
  #   chapter - contiguous numbers between the book part and a : or .
  #   verse(s) - numbers, possibly separated by a -, so '9', '9-12', '9 - 10', etc.
  #   version - any contiguous series of characters after the verse part
  # Whever possible, we allow arbitrary spaces betwen elements, so '1  john' and '1john' are OK.
  def human_ref_pattern
    #       --------- book ---------       -- chapter or chapters --           ---- verse or verses ----           - version -
    /^ \s* ([1-3]? \s* [A-Za-z]+ .? ) \s* (\d+ (?: \s* \-? \s* \d*))? (?:[:.] (\d+ (?: \s* \-? \s* \d*)))? [\.\s]* ([a-zA-Z]+)? \s*? $/x
  end

  # TODO: Make recognizer pattern recognize things like 'jas esv' and 'joshua'

  # Take a string of chapter(s) or verse(s) that can be like "1" or "1 - 3"
  # or "2-4" and return either the integer or integer range expressed.
  def dashed_to_range(dash_str)
    return unless dash_str
    tmp = dash_str.gsub(' ', '')
    items = tmp.split("-")
    if items.length > 1
      tmp = (items[0].to_i..items[1].to_i)
    else
      tmp = tmp.to_i
    end
  end

  def human_to_osis
    ref_pattern = human_ref_pattern
    hash = {}
    if match = ref_pattern.match(self.downcase)
      puts "Match was #{match.inspect}"
      book = match[1].gsub(/[ \.]/, '')
      chapters = dashed_to_range(match[2])
      verses = dashed_to_range(match[3])
      version = match[4].try(:strip)
      hash[:book] = book if book
      hash[:chapter] = chapters if chapters
      hash[:verse] = verses if verses
      hash[:version] = version if version
    else
      # puts "No matchy :("
    end
    hash
  end

# can't do this with when like this - may need to get rid of /x or something - not matching right
  def to_osis_hash
    case self.downcase
    when /^[123A-Za-z \.\-]*$/  # likeliest match is osis format
      puts "To the osis hash! (#{self.downcase})"
      self.parse_osis_format
    when human_ref_pattern # Probably more like 'Gen 1:1'
      puts "Oh, the humanity! (#{self.downcase})"
      self.human_to_osis
    else
      if human_ref_pattern.match(self.downcase)
        puts "Had to do a real match, but ok, it's human! (#{self.downcase})"
        self.human_to_osis
      else
        puts "NO WAY TO FIGURE IT OUT: [[[#{self.downcase}]]]! Punting to old way (parse_osis_format)"
        self.parse_osis_format
      end
    end
  end
end

class Array
  def to_osis_references
    map(&:osis).join("+")
  end
end

class Hash
  def to_osis_string
    string = self[:book]
    self[:chapter].is_a?(Range) ? string += "." + self[:chapter].first.to_s + "-" + self[:chapter].last.to_s : string += "." + self[:chapter].to_s if self[:chapter]
    self[:verse].is_a?(Range) ? string += "." + self[:verse].first.to_s + "-" + self[:verse].last.to_s : string += "." + self[:verse].to_s if self[:verse]
    string += "." + self[:version] if self[:version]
    string
  end
  
  def to_osis_string_noversion
    string = self[:book]
    self[:chapter].is_a?(Range) ? string += "." + self[:chapter].first.to_s + "-" + self[:chapter].last.to_s : string += "." + self[:chapter].to_s if self[:chapter]
    self[:verse].is_a?(Range) ? string += "." + self[:verse].first.to_s + "-" + self[:verse].last.to_s : string += "." + self[:verse].to_s if self[:verse]
    string
  end
  
end
