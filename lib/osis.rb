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
      hash[:version] = items[2]
    when 4
      hash[:chapter] = items[1].to_i
      hash[:version] = items[3]
      verses = items[2].split("-")
      hash[:verse] = verses.length == 1 ? verses.first.to_i : (verses[0].to_i..verses[1].to_i)
    end
    return hash
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
end
