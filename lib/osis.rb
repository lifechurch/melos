class String
  # The OSIS string format used at YouVersion is "[book].[chapter or chapter range].[opt. verse or verse range].[opt. version]"
  def to_osis_hash
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
